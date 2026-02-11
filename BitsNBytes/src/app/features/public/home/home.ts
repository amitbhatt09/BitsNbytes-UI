import { Component, computed, inject, signal } from '@angular/core';
import { BlogPostService } from '../../blogpost/services/blog-post-service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  blogPostService = inject(BlogPostService);

  blogPostsRef = this.blogPostService.getAllBlogPosts();
  isLoading = this.blogPostsRef.isLoading;
  allBlogPosts = this.blogPostsRef.value;

  // Pagination
  currentPage = signal(1);
  postsPerPage = 6;

  // Computed: total pages
  totalPages = computed(() => {
    const posts = this.allBlogPosts();
    if (!posts) return 0;
    return Math.ceil(posts.length / this.postsPerPage);
  });

  // Computed: posts for current page
  paginatedPosts = computed(() => {
    const posts = this.allBlogPosts();
    if (!posts) return [];
    
    const start = (this.currentPage() - 1) * this.postsPerPage;
    const end = start + this.postsPerPage;
    return posts.slice(start, end);
  });

  // Computed: page numbers array
  pageNumbers = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage() {
    this.goToPage(this.currentPage() + 1);
  }

  previousPage() {
    this.goToPage(this.currentPage() - 1);
  }
}
