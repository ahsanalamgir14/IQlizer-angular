import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product.interface';
import { ProductService } from '../product.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Auth } from 'aws-amplify';
import { from, Observable, pipe, of } from 'rxjs';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @ViewChild('iframe') myFrame: ElementRef;
  productData: Product[] = [];
  isLoading: boolean = true;
  displayedColumns: string[] = ['name', 'price', 'sku', 'category', 'upload'];
  //url: string = 'https://us-east-2.quicksight.aws.amazon.com/embedding/0d059dae5a964be2a2690e8f170255a0/start/analyses?code=AYABeHgTgtS9XMQouf2xNGq_BskAAAABAAdhd3Mta21zAEthcm46YXdzOmttczp1cy1lYXN0LTI6MjU5MzgxNDUwNDA2OmtleS8xZGQ4NmNiNy01MmE3LTQxMTItYTEyOC0zNTYzMzU0ODViZTkAuAECAQB4DdxVjF2aWiXFC5zLBOgTt1nyt51ucPSJkkn6lp9dUEkBb08QXOJRCg7vU7lPPSZ5QgAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDA46ojrcNkNhh5TKAgIBEIA7VoVrhU7as5hd97VACkFxYaTjmY0WqhmA6x8mlze_d03FcvndUu08_cJpcaz8yLG48JjOTmpfJrQMxWkCAAAAAAwAABAAAAAAAAAAAAAAAAAAsT41XhFjQeKG-BT0LPAbiv____8AAAABAAAAAAAAAAAAAAABAAAAm5FoMFHTQ4XqI42SDoicJlVQmikuX-m0D_SXreFbE_O7QzZtz__7M9Fq-enRFuTawW0IEoaO9nPIszU67tPI9uIe4Idiu459bcw2RaHLuDR0ejW4p1tqqv7uPQOQyavNMa02zYR93AklRX0cbifaoAC4eIxCnHXmwaYJe1OBJB6L86yHK1blmdyKGPJD4SxTQJKFKly78gnU8_tpqMzBZXLNkL-tS851DsAmgQ%3D%3D&identityprovider=quicksight&isauthcode=true';
  url: string ='';
  urlSafe: SafeResourceUrl;
   selectedFile: File = null!;  
   
   session$: Observable<CognitoUserSession> | undefined;
    idToken$: Observable<string> | undefined;
    isSubscribed$: Observable<string> | 'False';
    
    isSubscribed: string ='False';
    
  constructor(private productSvc: ProductService, private router: Router, public sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.productSvc.fetch().subscribe((data) => {
      this.productData = data;
      console.log(data);
      this.isLoading = false;
     // this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    });
    
     try {
      const s = Auth.currentSession().catch((err) => {
        console.log('Failed to get current session. Err: ', err);
        return err;
      });
      const session$ = from(s);
     
      const token$ = session$.pipe(
        map(
          (sesh) =>
            sesh && typeof sesh.getIdToken === 'function' && sesh.getIdToken()
        )
      );
      console.log(token$);

    // Subscribe to the token$ observable to get the actual token value
    token$.subscribe((token) => {
      
      this.isSubscribed$ = of(token.payload && token.payload['custom:isSubscribed']);
      
       // Log the user role after extracting it
      this.isSubscribed$.subscribe((isSubscribed:any) => {
        this.isSubscribed = isSubscribed;
        console.log("isSubscribed$:", isSubscribed);
      });
      
    });
     } catch (err) {
      console.error('Unable to get current session.');
    }
    
  }

  onEdit(product: Product) {
    this.router.navigate(['products', 'edit', product.productId]);
    return false;
  }
   onViewDashboard(product: Product) {
     this.isLoading = true;
      this.productSvc.get(product.shardId + ':' + product.productId , 'embed', product.category).subscribe((data) => {
        
      let  embedurl: string  =   data['embedURL']!;
      this.isLoading = false;
        this.router.navigate(['products', 'dashboard', embedurl]);
      });
  
  }
  openLink(product: Product): void {
    this.isLoading = true;
      this.productSvc.get(product.shardId + ':' + product.productId, 'console', product.category).subscribe((data) => {
        
      let  consoleurl: string  =   data['consoleURL']!;
      console.log(consoleurl) ;
      this.isLoading = false;
      this.router.navigate(['products', 'dashboard', consoleurl]);
      
      
      });
    
   
  }
  getElementInIframe() {
    // Accessing the iframe element
    var iframe = document.getElementById('iframe');
    if(iframe)
    alert(iframe)
    const iframeElement: HTMLIFrameElement = this.myFrame.nativeElement;

    // Accessing an element inside the iframe by ID
    iframeElement.onload = () => {
      if(iframeElement && iframeElement.contentDocument)
      {
        const elementInsideIframe = iframeElement.contentDocument.getElementById('application-header');
  
        if (elementInsideIframe) {
          // Do something with the element inside the iframe
          console.log(elementInsideIframe);
        } else {
          console.error('Element not found inside the iframe.');
        }
      }
    };
  }
  
    private openWindow(url: string): void {
    // Use a timeout to ensure that the window.open is triggered by user interaction
    setTimeout(() => {
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        // Popup was not blocked, do further handling if needed
      } else {
        // Popup was blocked, inform the user or handle the situation
        alert('Popup was blocked. Please allow pop-ups for this site.');
      }
    }, 100);
  }

onRemove(product: Product) {
  this.isLoading = true;

  this.productSvc.delete(product).subscribe(
    (data1) => {
      this.productSvc.fetch().subscribe(
        (data) => {
          this.productData = data;
          this.isLoading = false;
        },
        (error1) => {
          this.isLoading = false;
          alert(error1.message);
          console.error(error1);
        }
      );
    },
    (error) => {
      this.isLoading = false;
      alert(error.message);
      console.error(error);
    }
  );
}
  
  onCreate() {
    if(this.isSubscribed === 'False'){
          return;
    }
    this.router.navigate(['products', 'create']);
  }
 updateIframeUrl(newUrl: string): void {
    this.url = newUrl;
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(newUrl);
   
    console.log(newUrl) ;
  }
  
 
  
  onFileSelected(event:any, product: Product){
    this.isLoading = true;
    this.selectedFile = <File> event.target.files[0]; 
    
      this.productSvc.upload(product, this.selectedFile).subscribe((data) => {
        
     
      console.log('Done uploading') ;
      this.isLoading = false;
     
      
      });
     
    
  
  }

}
