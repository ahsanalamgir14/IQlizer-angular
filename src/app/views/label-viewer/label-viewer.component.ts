// import { Component } from '@angular/core';
// // @ts-ignore
// import { HttpClientModule } from '@angular/common/http';

// // const zplImageConvert = require('@replytechnologies/zpl-image-convert');

// @Component({
//   selector: 'app-zpl-to-image',
//   // template: `
//   //   <div>
//   //     <button (click)="convertZpl()">Convert ZPL to Image</button>
//   //     <img *ngIf="imageSrc" [src]="imageSrc" alt="Converted ZPL" /> 
//   //   </div>
//   // `,
//   templateUrl: './label-viewer.component.html',
//   styleUrls: ['./label-viewer.component.scss'],
// })
// export class LabelViewerComponent {
//   imageSrc: string | null = null;

//   zplCode = `
//       ^XA
//       ^FO50,50^ADN,36,20^FDHello ZPL!^FS
//       ^FO50,100^BY3^BCN,100,Y,N,N^FD12345678^FS
//       ^XZ
//     `;

//   async convertZpl() {
//     try {
//       const imageBuffer = await zplToImage(this.zplCode, {
//         width: 600, // Adjust width as needed
//         height: 300, // Adjust height as needed
//       });
//       this.imageSrc = `data:image/png;base64,${imageBuffer.toString('base64')}`;
//     } catch (error) {
//       console.error('Error converting ZPL to image:', error);
//     }
//   }
// }


// src/app/app.component.ts
// import { Component } from '@angular/core';
// import { ZplConverterService } from '../zpl-converter.service';

// @Component({
//   selector: 'app-root',
//   templateUrl: './label-viewer.component.html',
//   styleUrls: ['./label-viewer.component.scss'],
// })
// export class LabelViewerComponent {
//   zpl: string = `
//     ^XA
//     ^FO100,100
//     ^A0N,50,50
//     ^FDHello, World!^FS
//     ^FO100,200
//     ^B3N,N,100,Y,N
//     ^FD>:123456^FS
//     ^XZ
//   `;
//   imageUrl: string = '';

//   constructor(private zplConverterService: ZplConverterService) { }

//   convertZplToImage() {
//     this.zplConverterService.convertZplToImage(this.zpl).subscribe(
//       (imageBlob: Blob) => {
//         const imageUrl = URL.createObjectURL(imageBlob);
//         this.imageUrl = imageUrl;  // Set imageUrl to be used in the template
//       },
//       (error) => {
//         console.error('Error converting ZPL to image:', error);
//       }
//     );
//   }
// }

// src/app/app.component.ts
import { Component } from '@angular/core';
import { ZplPrinter } from 'zpl-image';

@Component({
  selector: 'app-root',
  templateUrl: './label-viewer.component.html',
  styleUrls: ['./label-viewer.component.scss'],
})
export class LabelViewerComponent {
  zpl: string = `
    ^XA
    ^FO100,100
    ^A0N,50,50
    ^FDHello, World!^FS
    ^FO100,200
    ^B3N,N,100,Y,N
    ^FD>:123456^FS
    ^XZ
  `;
  imageUrl: string = '';

  constructor() {}

  async convertZplToImage() {
    try {
      // Use the ZplPrinter class to convert ZPL to an image blob
      const zplPrinter = new ZplPrinter();
      const imageBlob = await zplPrinter.convert(this.zpl);
      
      // Convert the blob to a URL for display
      this.imageUrl = URL.createObjectURL(imageBlob);
    } catch (error) {
      console.error('Error converting ZPL to image:', error);
    }
  }
}
