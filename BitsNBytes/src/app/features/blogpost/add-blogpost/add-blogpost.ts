import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogPostService } from '../services/blog-post-service';
import { Router } from '@angular/router';
import { AddBlogPostRequest } from '../models/blogpost.model';
import { MarkdownComponent } from 'ngx-markdown';
import { CategoryService } from '../../category/services/category-service';

@Component({
  selector: 'app-add-blogpost',
  imports: [ReactiveFormsModule,MarkdownComponent],
  templateUrl: './add-blogpost.html',
  styleUrl: './add-blogpost.css',
})

export class AddBlogpost {

  blogPostService = inject(BlogPostService);
  categoryService = inject(CategoryService);
  router = inject(Router);

  private categoriesResourceRef = this.categoryService.getAllCategories();
  categoriesResponse = this.categoriesResourceRef.value;


  addBlogpostForm = new FormGroup({
    title: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required,Validators.minLength(10), Validators.maxLength(100)],
    }),
    shortDescription: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required,Validators.minLength(10), Validators.maxLength(300)],
    }),
    content: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required,Validators.minLength(10)],
    }),
    featuredImageUrl: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required,Validators.minLength(1), Validators.maxLength(200)],
    }),
    urlHandle: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required,Validators.minLength(1), Validators.maxLength(200)],
    }),
    publishedDate: new FormControl<string>(new Date().toISOString().split('T')[0],{
      nonNullable: true,
      validators: [Validators.required],
    }),
    author: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required,Validators.minLength(1), Validators.maxLength(200)],
    }),
    isVisible: new FormControl<boolean>(false,{
      
      nonNullable: true,
      
    }),
    categories: new FormControl<string[]>([]),
  });

  onSubmit(){
    const formRawValue = this.addBlogpostForm.getRawValue();
    console.log('Form Submitted:', formRawValue);

    const requestDto : AddBlogPostRequest  = {
      title: formRawValue.title,
      shortDescription: formRawValue.shortDescription,
      content: formRawValue.content,
      featuredImageUrl: formRawValue.featuredImageUrl,
      urlHandle: formRawValue.urlHandle,
      publishedDate: new Date(formRawValue.publishedDate),
      isVisible: formRawValue.isVisible,
      author: formRawValue.author,
      categories: formRawValue.categories ?? [],
    }
    this.blogPostService.createBlogPost(requestDto).subscribe({
      next: (response) => {
        console.log('Blogpost created successfully:', response);
        //navigate to blogpost list
        this.router.navigate(['/admin/blogposts']);
        this.addBlogpostForm.reset();
      },
      error: () => {
        console.error('Error creating blogpost');
      }
    });
  }
}
