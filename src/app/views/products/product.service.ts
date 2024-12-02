/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './models/product.interface';
import { HttpHeaders } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AdmissionHttpService } from './backend.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient,  private admissionSvc: AdmissionHttpService) {}
  baseUrl = `${localStorage.getItem('apiGatewayUrl')}`;

  fetch(): Observable<Product[]> {
   
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  get(productId: string, urlType?:string, dashboadId?:string): Observable<Product> {
    const url = `${this.baseUrl}/product/${productId}?dashboardid=${dashboadId}&urltype=${urlType}`;
    return this.http.get<Product>(url);
  }

  delete(product: Product) {
    const url = `${this.baseUrl}/product/${product.shardId}:${product.productId}?dataset_id=${product.name}&analysis_id=${product.sku}&dashboard_id=${product.category}`;
    return this.http.delete<Product>(url);
  }

  put(product: Product) {
    console.log("product service");
    console.log(product);
    const url = `${this.baseUrl}/product/${product.shardId}:${product.productId}`;
    return this.http.put<Product>(url, product);
  }

  post(product: Product, file: File, format: string) {
     // Create form data 
     const formData = new FormData();  
        
     // Store form name as "file" with file data 
     formData.append("file", file, file.name); 
          
    return this.http.post<Product>(`${this.baseUrl}/product?dataset_id=${product.name}&analysis_id=${product.sku}&dashboard_id=${product.category}&date_format=${format}`, formData);
  }
  
  upload(product: Product, file: File): Observable<any> {
    const url = `${this.baseUrl}/orders?file-name=${file.name}`;

    // Get the pre-signed URL
    return this.http.get(url).pipe(
      switchMap((data: any) => {
        const preSignedUrl = data.uploadUrl;
        console.log('2. PreSignedURL:', preSignedUrl);

        // Upload the file using the pre-signed URL
        return this.admissionSvc.uploadFile(preSignedUrl, file);
      })
    );
  }
  
}
