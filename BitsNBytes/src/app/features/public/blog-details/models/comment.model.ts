export interface Comment {
  id: string;
  content: string;
  userEmail: string;
  createdAt: string;
  blogPostId: string;
}

export interface CreateCommentRequest {
  content: string;
  blogPostId: string;
}
