import { Component, effect, inject, input } from '@angular/core';
import { BlogPostService } from '../services/blog-post-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';
import { CategoryService } from '../../category/services/category-service';
import { UpdateBlogPostRequest } from '../models/blogpost.model';
import { Router } from '@angular/router';
import { ImageSelector } from '../../../shared/components/image-selector/image-selector';
import { ImageSelectorService } from '../../../shared/services/image-selector-service';

@Component({
  selector: 'app-edit-blogpost',
  imports: [ReactiveFormsModule,MarkdownComponent,ImageSelector],
  templateUrl: './edit-blogpost.html',
  styleUrl: './edit-blogpost.css',
})
export class EditBlogpost {
  id = input<string>();
  blogPostService = inject(BlogPostService);
  categoryService = inject(CategoryService);
  imageSelectorService = inject(ImageSelectorService);
  router= inject(Router);

  private blogPostResourceRef = this.blogPostService.getBlogPostById(this.id);
  blogPostResponse = this.blogPostResourceRef.value;

  private categoriesResourceRef = this.categoryService.getAllCategories();
  categoriesResponse = this.categoriesResourceRef.value;
  
   editBlogpostForm = new FormGroup({
    title: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required,Validators.minLength(10), Validators.maxLength(100)],
    }),
    shortDescription: new FormControl<string>('',{
  nonNullable: true,
      validators: [Validators.required,Validators.minLength(10), Validators.maxLength(500)],
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

  effectRef = effect(()=>{
    if(this.blogPostResponse()){
        this.editBlogpostForm.patchValue({
        title: this.blogPostResponse()?.title,
        shortDescription: this.blogPostResponse()?.shortDescription,
        content: this.blogPostResponse()?.content,
        featuredImageUrl: this.blogPostResponse()?.featuredImageUrl,
        urlHandle: this.blogPostResponse()?.urlHandle,
        publishedDate: new Date(this.blogPostResponse()?.publishedDate!).toISOString().split('T')[0],
        author: this.blogPostResponse()?.author,
        isVisible: this.blogPostResponse()?.isVisible,
        categories: this.blogPostResponse()?.categories.map(c=>c.id) ?? [],
  });
    }

});
selectedImageEffectRef = effect(()=>{
  const selectedImage = this.imageSelectorService.selectedImage();
  if(selectedImage){
    this.editBlogpostForm.patchValue({
      featuredImageUrl: selectedImage,
    });
  }
});

 onSubmit(){
    console.log('🔵 onSubmit called');
    console.log('🔵 Form valid?', this.editBlogpostForm.valid);
    console.log('🔵 Form value:', this.editBlogpostForm.getRawValue());
    
    const id = this.id();
    console.log('🔵 ID:', id);
    
    if(id && this.editBlogpostForm.valid){
        const formValue = this.editBlogpostForm.getRawValue();
    const UpdateBlogPostRequestDto:UpdateBlogPostRequest={
            title: formValue.title,
            shortDescription: formValue.shortDescription,
            featuredImageUrl: formValue.featuredImageUrl,
            content: formValue.content,
            urlHandle: formValue.urlHandle,
        publishedDate: new Date(formValue.publishedDate),
        categories: formValue.categories??[],
            isVisible: formValue.isVisible,
            author: formValue.author,
        };
    this.blogPostService.editBlogPost(id,UpdateBlogPostRequestDto).subscribe({
        next:(response)=>{
          this.router.navigate(['/admin/blogposts']);
            console.log('Blog post updated successfully',response);
        },
        error:(error)=>{
            console.error('Error updating blog post',error);
            }
        });
    }

}
   onDelete(){
    const id = this.id();
    if(id){
      this.blogPostService.deleteBlogPost(id)
      .subscribe({
        next:(response)=>{
          console.log(response);
          this.router.navigate(['/admin/blogposts']);
          },
          error:()=>{
            console.error('Something went wrong! ');
          }
      })
    }
}

   openImageSelector(){
    this.imageSelectorService.displayImageSelector(); 
   }
}
