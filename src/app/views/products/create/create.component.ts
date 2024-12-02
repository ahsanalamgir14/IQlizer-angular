import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductService } from '../product.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  productForm: FormGroup;
  loading = false;
  file: File = null!; // Variable to store file 
  categories: string[] = ['category1', 'category2', 'category3', 'category4'];
  fileErrorMessage:string;
  dateFormats: { text: string, value: string }[] = [];
  selectedFormat: string = '';
  constructor(
    private fb: FormBuilder,
    private productSvc: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      dateFormat: ['MM/dd/yyyy', Validators.required],
      price: 1,
      sku: '',
      category: '',
      file: [null, Validators.required],
    });
    
    const currentDate = new Date();
    this.dateFormats = [
      { text: formatDate(currentDate, 'dd/MM/yyyy', 'en-US'), value: 'dd/MM/yyyy' },
      { text: formatDate(currentDate, 'dd/MM/yyyy', 'en-US'), value: 'dd/MM/yyyy' },
      { text: formatDate(currentDate, 'dd/MMM/yyyy', 'en-US'), value: 'dd/MMM/yyyy' },
      { text: formatDate(currentDate, 'dd/MMM/yyyy', 'en-US'), value: 'dd/MMM/yyyy' },
      { text: formatDate(currentDate, 'dd-MMM-yyyy', 'en-US'), value: 'dd-MMM-yyyy' },
      { text: formatDate(currentDate, 'dd-MMM-yyyy', 'en-US'), value: 'dd-MMM-yyyy' },
      { text: formatDate(currentDate, 'dd-MM-yyyy', 'en-US'), value: 'dd-MM-yyyy' },
      { text: formatDate(currentDate, 'dd-MM-yyyy', 'en-US'), value: 'dd-MM-yyyy' },
      { text: formatDate(currentDate, 'MM/dd/yyyy', 'en-US'), value: 'MM/dd/yyyy' },
      { text: formatDate(currentDate, 'MM/dd/yyyy', 'en-US'), value: 'MM/dd/yyyy' },
      { text: formatDate(currentDate, 'MM-dd-yyyy', 'en-US'), value: 'MM-dd-yyyy' },
      { text: formatDate(currentDate, 'MM-dd-yyyy', 'en-US'), value: 'MM-dd-yyyy' },
      { text: formatDate(currentDate, 'MMM/dd/yyyy', 'en-US'), value: 'MMM/dd/yyyy' },
      { text: formatDate(currentDate, 'MMM/dd/yyyy', 'en-US'), value: 'MMM/dd/yyyy' },
      { text: formatDate(currentDate, 'MMM-dd-yyyy', 'en-US'), value: 'MMM-dd-yyyy' },
      { text: formatDate(currentDate, 'MMM-dd-yyyy', 'en-US'), value: 'MMM-dd-yyyy' },
      { text: formatDate(currentDate, 'yyyy/MM/dd', 'en-US'), value: 'yyyy/MM/dd' },
      { text: formatDate(currentDate, 'yyyy/MM/dd', 'en-US'), value: 'yyyy/MM/dd' },
      { text: formatDate(currentDate, 'yyyy/MMM/dd', 'en-US'), value: 'yyyy/MMM/dd' },
      { text: formatDate(currentDate, 'yyyy/MMM/dd', 'en-US'), value: 'yyyy/MMM/dd' },
      { text: formatDate(currentDate, 'yyyy-MM-dd', 'en-US'), value: 'yyyy-MM-dd' },
      { text: formatDate(currentDate, 'yyyy-MM-dd', 'en-US'), value: 'yyyy-MM-dd' },
      { text: formatDate(currentDate, 'yyyy-MMM-dd', 'en-US'), value: 'yyyy-MMM-dd' },
      { text: formatDate(currentDate, 'yyyy-MMM-dd', 'en-US'), value: 'yyyy-MMM-dd' },
      { text: formatDate(currentDate, 'yyyyMMdd', 'en-US'), value: 'yyyyMMdd' },
      { text: formatDate(currentDate, 'yyyy-MM-dd', 'en-US'), value: 'yyyy-MM-dd' },
      { text: formatDate(currentDate, 'yyyyMMdd', 'en-US'), value: 'yyyyMMdd' },
      { text: formatDate(currentDate, 'MM/dd/yyyy', 'en-US'), value: 'MM/dd/yyyy' },
      { text: formatDate(currentDate, 'dd/MM/yyyy', 'en-US'), value: 'dd/MM/yyyy' },
      { text: formatDate(currentDate, 'yyyy/MM/dd', 'en-US'), value: 'yyyy/MM/dd' },
      { text: formatDate(currentDate, 'MMM/dd/yyyy', 'en-US'), value: 'MMM/dd/yyyy' },
      { text: formatDate(currentDate, 'dd/MMM/yyyy', 'en-US'), value: 'dd/MMM/yyyy' },
      { text: formatDate(currentDate, 'yyyy/MMM/dd', 'en-US'), value: 'yyyy/MMM/dd' },
      { text: formatDate(currentDate, 'yyyy-MM-dd', 'en-US'), value: 'yyyy-MM-dd' },
      { text: formatDate(currentDate, 'MM-dd-yyyy', 'en-US'), value: 'MM-dd-yyyy' },
      { text: formatDate(currentDate, 'dd-MM-yyyy', 'en-US'), value: 'dd-MM-yyyy' },
      { text: formatDate(currentDate, 'yyyy-MM-dd', 'en-US'), value: 'yyyy-MM-dd' },
      { text: formatDate(currentDate, 'MMM-dd-yyyy', 'en-US'), value: 'MMM-dd-yyyy' },
      { text: formatDate(currentDate, 'dd-MMM-yyyy', 'en-US'), value: 'dd-MMM-yyyy' },
      { text: formatDate(currentDate, 'yyyy-MMM-dd', 'en-US'), value: 'yyyy-MMM-dd' }
    ];







    // Set the default value to "MM/dd/yyyy"
    this.selectedFormat = 'MM/dd/yyyy';
  }
  // On file Select 
  onChange(event: any) { 
    this.file = event.target.files[0]; 
    this.fileErrorMessage = '';
    if (this.file) 
    {
     
      const maxSize = 1024 * 1024 * 10; // 1 MB  
      if (this.file.size > maxSize) 
      {
          console.log(this.file.size);
          this.fileErrorMessage = 'File size exceeds the 10mb limit. Please select a smaller file.';
          // Clear the file input
          event.target.value = '';
          this.productForm.get('file')?.setValue(null);
      }
      else
      {
        let fileName = event.target.files[0].name;
        fileName = fileName.replace(".csv", "");
        this.productForm.get('name')?.setValue(fileName); // Using setValue method
        this.productForm.get('sku')?.setValue(fileName); // Using setValue method
        this.productForm.get('category')?.setValue(fileName); // Using setValue method
      }
    }

  } 
  get name() {
    return this.productForm.get('name');
  }

  get price() {
    return this.productForm.get('price');
  }

  submit() {
     this.loading = true;

  
    this.productSvc.post(this.productForm.value, this.file, this.selectedFormat).subscribe({
      next: () => this.router.navigate(['products']),
      error: (err) => {
        this.loading = false;
        alert(err.message);
        console.error(err);
      },
    });
    
  }

  cancel() {
    this.router.navigate(['products']);
  }
  
  public GetFileOnLoad(event: any) {
var file = event.target.files[0];
var element = document.getElementById("fakeFileInput") as HTMLInputElement | null;
if(element != null) {
  element.value = file?.name;
}
}
}
