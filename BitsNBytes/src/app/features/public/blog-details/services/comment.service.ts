import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Comment, CreateCommentRequest } from '../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  http = inject(HttpClient);
  apiBaseUrl = environment.apiBaseUrl;

  createComment(request: CreateCommentRequest): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiBaseUrl}/api/comments`, request, {
      withCredentials: true
    });
  }

  getCommentsByBlogPostId(blogPostId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiBaseUrl}/api/comments/${blogPostId}`);
  }
}
