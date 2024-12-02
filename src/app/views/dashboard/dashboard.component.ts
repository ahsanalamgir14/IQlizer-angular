import { Component,  OnInit, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { ProductService } from '../products/product.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  @Input() safeUrl: SafeResourceUrl | null = null;
    products: any[] = [];
    isLoading: boolean = true;
    selectedDashboard:string;
  constructor(private productSvc: ProductService, private sanitizer: DomSanitizer) {}
  
   ngOnInit(): void {
      if (localStorage.getItem('refresh')) { 
        location.reload() 
        localStorage.removeItem('refresh') 
      } 
    this.productSvc.fetch().subscribe((data) => {
      this.products = data;
      console.log(data);
      if (this.products.length > 0) {
          //this.onProductSelectionChange({ target: { value: this.products[0] } } as unknown as Event);
          this.fetchEmbededURL(this.products[0]);

        }
        console.log('Products retrieved successfully:', this.products);
      this.isLoading = false;
     // this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    });
  }
  onProductSelectionChange(event: Event): void {
    const selectedIndex = (event.target as HTMLSelectElement).selectedIndex;

    const selectedCategory = this.products[selectedIndex];
   
    console.log(selectedCategory);
    if (selectedCategory !== null ) {
      this.fetchEmbededURL(selectedCategory);
      // Log the selected category or perform any other actions
      console.log('Selected Category:', selectedCategory);
    }
  }
  private fetchEmbededURL(data: any): void {
     this.isLoading = true;
      const keyid = data?.key;
       const dashboardId = data?.category;
       this.selectedDashboard = data?.name;
      this.productSvc.get(keyid , 'embed',dashboardId).subscribe((data:any) => {
        
      let  embedurl: string  =   data['embedURL']!;
       this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedurl);
        console.log('Products retrieved successfully:', this.products);
      this.isLoading = false;
       
      });
  }
  
  
}
