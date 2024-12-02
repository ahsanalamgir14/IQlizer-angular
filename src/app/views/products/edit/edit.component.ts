/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Product } from '../models/product.interface';
import { ProductService } from '../product.service';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/models/user';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  productForm: FormGroup;
  categories: string[] = ['category1', 'category2', 'category3', 'category4'];
  displayedColumns: string[] = [
    'email',
    'enabled',
  ];
  product$: Observable<Product | undefined> | undefined;
  userData: User[] = [];
  productId$: Observable<string> | undefined;
  productName$: Observable<string | undefined> | undefined;
  loading = false;

   
  selectedEmails: string = '';
  constructor(
    private fb: FormBuilder,
    private productSvc: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private userSvc: UsersService
  ) {
    this.productForm = this.fb.group({});
  }

  ngOnInit(): void {
  this.productForm = this.fb.group({
    shardId: [],
    productId: [],
    users: '',
    name: '',
    price: '',
    sku: '',
    category: '',
  });

  this.productId$ = this.route.params.pipe(map((p) => p['productId']));
  this.product$ = this.productId$.pipe(
    switchMap((p) => this.productSvc.get(p))
  );
  
  this.productName$ = this.product$.pipe(map((p) => p?.name));

  this.product$.subscribe((val) => {
     const allowed_users = val?.allowed_users;
    console.log(val);

    // Assuming userData is an array of user objects with 'enabled' and 'email' properties
    this.userSvc.fetch().subscribe((data) => {
      this.userData = data;

      // Enable users whose email is present in allowed_users
      this.userData.forEach(user => {
        user.enabled = allowed_users?.split(',').includes(user.email);;
      });

      // Filter and map enabled users' emails
      const selectedEmailsArray = this.userData
        .filter(user => user.enabled)
        .map(user => user.email);

      // Join the emails into a comma-separated string
      this.selectedEmails = selectedEmailsArray.join(', ');

      console.log(this.selectedEmails);
    });

    this.productForm?.patchValue({
      ...val,
    });
  });
}

  get name() {
    return this.productForm?.get('name');
  }

  get price() {
    return this.productForm?.get('price');
  }

  submit() {
     this.productForm.get('users')?.setValue(this.selectedEmails);
     this.loading = true;
     console.log(this.productForm?.value);
    this.productSvc.put(this.productForm?.value).subscribe({
      
      next: () => this.router.navigate(['products']),
      error: (err) => console.error(err),
    });
    
   
  }
updateSelectedEmails(element: any){
  element.enabled = !element.enabled; 
 
    const selectedEmailsArray = this.userData
      .filter(user => user.enabled)
      .map(user => user.email);

    this.selectedEmails = selectedEmailsArray.join(', ');
     console.log(this.selectedEmails);  

  }
  delete() {
    this.productSvc.delete(this.productForm?.value).subscribe({
      next: () => this.router.navigate(['products']),
      error: (err) => {
         this.loading = false;
        alert(err);
        console.error(err);
        
      },
    });
  }

  cancel() {
    this.router.navigate(['products']);
  }
  
  
}
