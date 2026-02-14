import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, InputSignal, signal } from '@angular/core';
import { AddCategoryRequest, Category, UpdateCategoryRequest } from '../models/category.model';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private  http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;

  addCategoryStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  updateCategoryStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  addCategory(category:AddCategoryRequest) {
    this.addCategoryStatus.set('loading');
    this.http.post<void>(`${this.apiBaseUrl}/api/Categories`,category,{
      withCredentials: true
    })
    .subscribe({
      next: () => {
        this.addCategoryStatus.set('success');
      },
      error: () => {
        this.addCategoryStatus.set('error');
      }
    });
  } 

  getAllCategories() {
    return httpResource<Category[]>(()=>({
      url: `${this.apiBaseUrl}/api/Categories`,
      withCredentials: true  // ✅ Add this
    }));
}

  getCategoryById(id:InputSignal<string | undefined>) {
    return httpResource<Category>(()=>({
      url: `${this.apiBaseUrl}/api/Categories/${id()}`,
      withCredentials: true  // ✅ Add this
    }));
}

  updateCategory(id:string, updateCategoryRequestDto:UpdateCategoryRequest) {
    this.updateCategoryStatus.set('loading');
    this.http.put<void>(`${this.apiBaseUrl}/api/categories/${id}`,updateCategoryRequestDto,{
      withCredentials: true
    })
    .subscribe({
      next: () => {
        this.updateCategoryStatus.set('success'); 
      }, 
      error: () => {
        this.updateCategoryStatus.set('error'); 
      }
    });
  }

  deleteCategory(id:string):Observable<void>{
    return this.http.delete<void>(`${this.apiBaseUrl}/api/categories/${id}`,{
      withCredentials: true
    });
  }
}
