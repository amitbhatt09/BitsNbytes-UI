import { Component, effect, inject, input, signal } from '@angular/core';
import { BlogPostService } from '../../blogpost/services/blog-post-service';
import { CommentService } from './services/comment.service';
import { AuthService } from '../../auth/services/auth-service';
import { Comment } from './models/comment.model';
import { DatePipe } from '@angular/common';
import { MarkdownComponent } from "ngx-markdown";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-details',
  imports: [DatePipe, MarkdownComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.css',
})
export class BlogDetails {
  url = input<string | undefined>();
  blogPostService = inject(BlogPostService);
  commentService = inject(CommentService);
  authService = inject(AuthService);

  // Fetch blog post
  blogDetailsRef = this.blogPostService.getBlogPostByUrlHandle(this.url);
  isLoading = this.blogDetailsRef.isLoading;
  blogDetailsResponse = this.blogDetailsRef.value;

  // Comments state
  comments = signal<Comment[]>([]);
  commentLoading = signal(false);

  // Comment form
  commentForm = new FormGroup({
    content: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)]
    })
  });
  get contentControl() { return this.commentForm.controls.content; }

  // Once the blog post loads, fetch its comments
  private loadCommentsEffect = effect(() => {
    const post = this.blogDetailsResponse();
    if (post?.id) {
      this.fetchComments(post.id);
    }
  });

  private fetchComments(blogPostId: string) {
    this.commentLoading.set(true);
    this.commentService.getCommentsByBlogPostId(blogPostId).subscribe({
      next: (data) => {
        this.comments.set(data);
        this.commentLoading.set(false);
      },
      error: () => {
        this.commentLoading.set(false);
      }
    });
  }

  onSubmitComment() {
    if (this.commentForm.invalid) return;
    const post = this.blogDetailsResponse();
    if (!post) return;

    const request = {
      content: this.commentForm.getRawValue().content,
      blogPostId: post.id
    };

    this.commentService.createComment(request).subscribe({
      next: (newComment) => {
        // Prepend to list so it appears at the top instantly
        this.comments.update(prev => [newComment, ...prev]);
        this.commentForm.reset();
      },
      error: (err) => {
        console.error('Comment failed:', err);
      }
    });
  }
}
