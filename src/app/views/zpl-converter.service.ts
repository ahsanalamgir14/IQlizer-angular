// src/app/zpl-converter.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZplConverterService {

  // private apiUrl = 'https://api.labelary.com/v1/printers/8dpmm/labels/4x6/1';  // Example endpoint
  private apiUrl = 'https://api.labelary.com/v1/printers/8dpmm/labels/4x6/1';  // Example endpoint

  constructor(private http: HttpClient) { }

  // Function to send ZPL data and receive image as response
  convertZplToImage(zpl: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Host': 'api.labelary.com',
      'Accept': '*/*',
    });

    const body = {
      zpl_data: zpl
    };

    // POST request to Labelary API
    return this.http.post(this.apiUrl, body, { headers, responseType: 'blob' });
  }
}
