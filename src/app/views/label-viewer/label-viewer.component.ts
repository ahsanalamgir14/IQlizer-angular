// import { Component } from '@angular/core';
// import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
// // const zplImageConvert = require('@replytechnologies/zpl-image-convert');
// // import * as zplImageConvert from '@replytechnologies/zpl-image-convert';
// // const zlib = require("zlib");
// import * as pako from 'pako'; 

// const pivotedMapCode: any = {
//   // pivoted
//   G: 1,
//   H: 2,
//   I: 3,
//   J: 4,
//   K: 5,
//   L: 6,
//   M: 7,
//   N: 8,
//   O: 9,
//   P: 10,
//   Q: 11,
//   R: 12,
//   S: 13,
//   T: 14,
//   U: 15,
//   V: 16,
//   W: 17,
//   X: 18,
//   Y: 19,
//   g: 20,
//   h: 40,
//   i: 60,
//   j: 80,
//   k: 100,
//   l: 120,
//   m: 140,
//   n: 160,
//   o: 180,
//   p: 200,
//   q: 220,
//   r: 240,
//   s: 260,
//   t: 280,
//   u: 300,
//   v: 320,
//   w: 340,
//   x: 360,
//   y: 380,
//   z: 400,
// };

// @Component({
//   selector: 'app-root',
//   templateUrl: './label-viewer.component.html',
//   styleUrls: ['./label-viewer.component.scss'],
// })
// export class LabelViewerComponent {
//   imageUrl: SafeUrl = '';
//   zpl: string = `^XA
// ^FO100,100
// ^A0N,50,50
// ^FDHello, World!^FS
// ^FO100,200
// ^B3N,N,100,Y,N
// ^FD>:123456^FS
// ^XZ
// `;

//   constructor(private sanitizer: DomSanitizer) { }

//   // decodeZ64(data: any) {
//   //   // trim :Z64:
//   //   data = data.substring(5);
//   //   // trim trailing crc
//   //   data = data.substring(0, data.length - 5);

//   //   const deflatedData = Buffer.from(data, "base64");
//   //   const buffer = zlib.inflateSync(deflatedData);
//   //   return buffer;
//   // }
//   decodeZ64(data: any) {
//   // trim :Z64:
//   data = data.substring(5);
//   // trim trailing crc
//   data = data.substring(0, data.length - 5);

//   const deflatedData = Buffer.from(data, "base64");  // base64 decoded data
//   const inflatedData = pako.inflate(deflatedData); // pako's inflate method

//   return inflatedData;
// }

//   decodeASCII(data: any, size: any, lineByteCount: any) {
//     console.log("Decoding ASCII data...");
//     console.log("Data length:", data.length);
//     console.log("Expected buffer size:", size);

//     // Convert lineByteCount (which is a string) to a number
//     const byteCount = parseInt(lineByteCount, 10);

//     // Validate that byteCount is a valid number and greater than zero
//     if (isNaN(byteCount) || byteCount <= 0) {
//       throw new Error("Invalid lineByteCount value: " + lineByteCount);
//     }
//     console.log('lineByteCount:', byteCount);

//     // Calculate lineWordCount based on byteCount
//     const lineWordCount = byteCount * 2; // each byte is 2 words
//     console.log('lineWordCount:', lineWordCount);

//     if (lineWordCount <= 0) {
//       throw new Error("Invalid lineWordCount value: " + lineWordCount);
//     }
//     const buffer = new Uint8Array(size);

//     if (lineWordCount <= 0) {
//       throw new Error("Invalid lineWordCount value: " + lineWordCount);
//     }

//     // inflate data from map codes
//     let inflatedData = "";
//     let index = 0;
//     while (index < data.length) {
//       let character = data[index++];

//       if (pivotedMapCode[character]) {
//         let code = "";
//         while (pivotedMapCode[character]) {
//           code += character;
//           character = data[index++];
//         }
//         const multiplier = this.getMapCodeCount(code);
//         inflatedData += new Array(multiplier + 1).join(character);
//       } else {
//         inflatedData += character;
//       }
//     }

//     // expand shortened data rows
//     let expandedData = "";
//     index = 0;
//     while (index < inflatedData.length) {
//       console.log("expandedData.length:", expandedData.length);
//       console.log("lineWordCount:", lineWordCount);
//       let character = inflatedData[index++];
//       let remainingLength = lineWordCount - (expandedData.length % lineWordCount);

//       // Ensure valid remainingLength
//       if (remainingLength <= 0 || isNaN(remainingLength)) {
//         remainingLength = lineWordCount;
//         console.warn("Adjusted remainingLength:", remainingLength);
//       }

//       if (character == ",") {
//         expandedData += new Array(remainingLength + 1).join("0");
//       } else if (character == "!") {
//         if (remainingLength > 0) {
//           expandedData += new Array(remainingLength + 1).join("F");
//         } else {
//           console.error("Invalid remainingLength:", remainingLength);
//         }
//         expandedData += new Array(remainingLength + 1).join("F");
//       } else if (character == ":") {
//         expandedData += expandedData.substring(
//           expandedData.length - lineWordCount,
//           expandedData.length
//         );
//       } else {
//         expandedData += character;
//       }
//     }

//     // convert data into buffer
//     let bufferIndex = 0;
//     index = 0;
//     while (index < expandedData.length) {
//       let character = expandedData[index++];
//       let nextCharacter = expandedData[index++];
//       buffer[bufferIndex++] = Number.parseInt(character + nextCharacter, 16);
//     }

//     return buffer;
//   }

//   getMapCodeCount(code: any) {
//     let value = 0;

//     for (let index = 0; index < code.length; index++) {
//       value += pivotedMapCode[code[index]];
//     }
//     return value;
//   }

//   async decode(text: any) {
//     text = text.trim();

//     if (!text.startsWith("^GFA") && !text.startsWith("^XA")) {
//       throw new Error("Unsupported encoding");
//     }

//     // trim ^GF
//     if (text.startsWith("^GF")) {
//       text = text.substring(3);
//     }

//     // trim trailing '^FS'
//     if (text.endsWith("^FS")) {
//       text = text.substring(0, text.length - 3);
//     }

//     // a: compression type (A, B, C)
//     let commaIndex = text.indexOf(",");
//     const a = text.substring(0, commaIndex);
//     text = text.substring(commaIndex + 1);

//     // b: binary byte count
//     commaIndex = text.indexOf(",");
//     const b = text.substring(0, commaIndex);
//     text = text.substring(commaIndex + 1);

//     // c: graphic field count
//     commaIndex = text.indexOf(",");
//     const c = text.substring(0, commaIndex);
//     text = text.substring(commaIndex + 1);

//     // d: bytes per row
//     commaIndex = text.indexOf(",");
//     const d = text.substring(0, commaIndex);

//     const data = text.substring(commaIndex + 1);
//     let buffer: any = null;

//     const width = d * 8;
//     const height = c / d;

//     if (data.startsWith(":Z64:")) {
//       buffer = this.decodeZ64(data);
//     } else {
//       buffer = this.decodeASCII(data, c, d);
//     }

//     return {
//       width,
//       height,
//       buffer,
//       getPixelBit: (x: any, y: any) => {
//         const byteIndex = y * (width / 8) + ~~(x / 8);
//         const byte = buffer[byteIndex];
//         const bit = (byte >> (7 - (x % 8))) & 0x01;
//         return bit;
//       },
//     };
//   }

//   // async convertZplToImage() {
//   //   try {
//   //     // Decode the ZPL data
//   //     const decodedData = await this.decode(this.zpl);

//   //     // Create a Blob from the buffer
//   //     const { width, height, buffer } = decodedData;
//   //     const blob = new Blob([new Uint8Array(buffer)], { type: 'image/png' });

//   //     // Convert the blob to a URL for display
//   //     this.imageUrl = URL.createObjectURL(blob);
//   //   } catch (error) {
//   //     console.error('Error converting ZPL to image:', error);
//   //   }
//   // }
//   // async convertZplToImage() {
//   //   try {
//   //     // Convert ZPL to an image Blob using the library
//   //     // const imageBlob = await this.decode(this.zpl);

//   //     const decodedData = await this.decode(this.zpl);


//   //     const { width, height, buffer } = decodedData;
//   //     const blob = new Blob([new Uint8Array(buffer)], { type: 'image/png' });

//   //     // Convert the Blob URL to a SafeUrl for Angular
//   //     this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
//   //   } catch (error) {
//   //     console.error('Error converting ZPL to image:', error);
//   //   }
//   // }

//   async convertZplToImage() {
//     try {
//       const decodedData = await this.decode(this.zpl);
//       let { width, height, buffer } = decodedData;
  
//       // Validate width and height
//       width = Math.floor(Number(width));
//       height = Math.floor(Number(height));
  
//       if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
//         throw new Error(`Invalid width (${width}) or height (${height}).`);
//       }
  
//       // Create a canvas element to draw the image
//       const canvas = document.createElement('canvas');
//       canvas.width = width;
//       canvas.height = height;
  
//       const context = canvas.getContext('2d');
//       if (!context) {
//         throw new Error('Failed to get 2D context for the canvas.');
//       }
  
//       // Create image data from buffer
//       const imageData = context.createImageData(width, height);
//       for (let i = 0; i < buffer.length; i++) {
//         const color = buffer[i] ? 0 : 255; // Convert buffer values to black or white
//         const index = i * 4; // RGBA index
//         imageData.data[index] = color; // Red
//         imageData.data[index + 1] = color; // Green
//         imageData.data[index + 2] = color; // Blue
//         imageData.data[index + 3] = 255; // Alpha
//       }
  
//       // Put image data on the canvas
//       context.putImageData(imageData, 0, 0);
  
//       // Convert canvas to a Blob and create a SafeUrl
//       canvas.toBlob((blob) => {
//         if (blob) {
//           this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
//         } else {
//           console.error('Failed to create a Blob from the canvas.');
//         }
//       }, 'image/png');
//     } catch (error) {
//       console.error('Error converting ZPL to image:', error);
//     }
//   }
  
  
// }








import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PNG } from 'pngjs/browser';
import * as pako from 'pako';

@Component({
  selector: 'app-root',
  templateUrl: './label-viewer.component.html',
  styleUrls: ['./label-viewer.component.scss'],
})
export class LabelViewerComponent {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  zplCode: string = `
  ^XA
  ^FO100,100
  ^A0N,50,50
  ^FDHello, World!^FS
  ^FO100,200
  ^B3N,N,100,Y,N
  ^FD>:123456^FS
  ^XZ
`;
imageUrl: SafeUrl | null = null; // Safe URL for the generated image

constructor(private sanitizer: DomSanitizer) {}

// async convertZplToImage() {
//   try {
//     // Decode ZPL to image data
//     const decodedData = await this.decode(this.zpl);
//     if (!decodedData) {
//       throw new Error('Decoding returned no data.');
//     }

//     const { width, height, buffer } = decodedData;

//     // Validate width, height, and buffer
//     if (!width || !height || !buffer) {
//       throw new Error(`Invalid decoded data: width=${width}, height=${height}, buffer=${buffer}`);
//     }

//     const parsedWidth = Number(width);
//     const parsedHeight = Number(height);

//     if (isNaN(parsedWidth) || isNaN(parsedHeight) || parsedWidth <= 0 || parsedHeight <= 0) {
//       throw new Error(`Invalid width (${parsedWidth}) or height (${parsedHeight}).`);
//     }

//     // Create a canvas element to draw the image
//     const canvas = document.createElement('canvas');
//     canvas.width = parsedWidth;
//     canvas.height = parsedHeight;

//     const context = canvas.getContext('2d');
//     if (!context) {
//       throw new Error('Failed to get 2D context for the canvas.');
//     }

//     // Create image data from buffer
//     const imageData = context.createImageData(parsedWidth, parsedHeight);
//     for (let i = 0; i < buffer.length; i++) {
//       const color = buffer[i] ? 0 : 255; // Convert buffer values to black or white
//       const index = i * 4; // RGBA index
//       imageData.data[index] = color; // Red
//       imageData.data[index + 1] = color; // Green
//       imageData.data[index + 2] = color; // Blue
//       imageData.data[index + 3] = 255; // Alpha
//     }

//     // Put image data on the canvas
//     context.putImageData(imageData, 0, 0);

//     // Convert canvas to a Blob and create a SafeUrl
//     canvas.toBlob((blob) => {
//       if (blob) {
//         this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
//       } else {
//         console.error('Failed to create a Blob from the canvas.');
//       }
//     }, 'image/png');
//   } catch (error) {
//     console.error('Error converting ZPL to image:', error);
//   }
// }

// // Simulated decode function (Replace with actual implementation)
// private async decode(zpl: string): Promise<{ width: number; height: number; buffer: Uint8Array }> {
//   // Example logic to simulate decoding ZPL to raw image data
//   return new Promise((resolve, reject) => {
//     try {
//       // Simulated data; replace with actual decoding logic
//       const width = 300; // Replace with extracted width
//       const height = 200; // Replace with extracted height
//       const buffer = new Uint8Array(width * height); // Simulated black-and-white pixel data

//       // Fill buffer with sample data (for testing purposes)
//       for (let i = 0; i < buffer.length; i++) {
//         buffer[i] = i % 2; // Alternating black and white pixels
//       }

//       resolve({ width, height, buffer });
//     } catch (err) {
//       reject(err);
//     }
//   });
// }

convertZplToImage() {
  try {
    // Parse ZPL and generate pixel data
    const { width, height, buffer } = this.decodeZplToImage(this.zplCode);

    // Access the canvas and set dimensions
    const canvas = this.canvas.nativeElement;
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get canvas rendering context.');
    }

    // Create ImageData from buffer
    const imageData = context.createImageData(width, height);
    for (let i = 0; i < buffer.length; i++) {
      const color = buffer[i] ? 0 : 255; // Black or white
      const index = i * 4; // RGBA index
      imageData.data[index] = color;     // Red
      imageData.data[index + 1] = color; // Green
      imageData.data[index + 2] = color; // Blue
      imageData.data[index + 3] = 255;   // Alpha
    }

    // Draw the image data to the canvas
    context.putImageData(imageData, 0, 0);
  } catch (error) {
    console.error('Error converting ZPL to image:', error);
  }
}

// Function to decode ZPL into image data (simplified)
decodeZplToImage(zpl: string): { width: number; height: number; buffer: Uint8Array } {
  // Placeholder parsing logic: Replace this with actual ZPL decoding
  // Example assumes a fixed size image and simple binary pattern
  const width = 300;  // Width of the image
  const height = 200; // Height of the image

  // Simulated buffer with alternating black-and-white pixels
  const buffer = new Uint8Array(width * height);
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = i % 2; // Simulated pixel data: alternating black (1) and white (0)
  }

  return { width, height, buffer };
}
}



// private zplContent: string = `
// ^XA
// ^FO100,100
// ^A0N,50,50
// ^FDHello, World!^FS
// ^FO100,200
// ^B3N,N,100,Y,N
// ^FD>:123456^FS
// ^XZ
// `;
//  // ZPL content loaded from file

//   onFileSelected(event: Event) {
//     const file = (event.target as HTMLInputElement).files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       this.zplContent = reader.result as string;
//     };
//     reader.readAsText(file);
//   }

//   // convertZplToPng() {
//   //   try {
//   //     const z64ZplContent = `
//   //       ^XA
//   //       ^FO20,20
//   //       ^GF50,10,10,:Z64:eJztwTEBAAAAwqD1T20JT6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==:
//   //       ^XZ
//   //     `;
  
//   //     const match = /(\d+),(\d+),(\d+),:Z64:([^:]+):/.exec(z64ZplContent);
//   //     if (!match) {
//   //       throw new Error('Invalid ZPL format or missing Z64 content');
//   //     }
  
//   //     const size = +match[1];
//   //     const rowl = +match[3];
//   //     const compressedData = match[4];
  
//   //     // Validate Base64 string
//   //     if (!compressedData.match(/^[A-Za-z0-9+/=]+$/)) {
//   //       throw new Error('Invalid Base64 data in ZPL');
//   //     }
  
//   //     const decodedData = Uint8Array.from(atob(compressedData), (char) => char.charCodeAt(0));
//   //     const grf = pako.inflate(decodedData);
  
//   //     console.log('Decompressed Data:', grf);
  
//   //     // Rest of the PNG creation logic remains unchanged...
//   //   } catch (error) {
//   //     console.error('Error converting ZPL to PNG:', error);
//   //   }
//   // }
// }