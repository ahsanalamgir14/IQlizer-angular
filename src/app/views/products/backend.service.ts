import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {HttpBackend, HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';

//https://medium.com/nerd-for-tech/how-to-bypass-angular-http-interceptor-2491afca16a3

@Injectable({
  providedIn: 'root'
})
export class AdmissionHttpService {
  private httpClient: HttpClient;
  constructor(
    private handler: HttpBackend,
  ) {
    this.httpClient = new HttpClient(handler);
  }

  uploadFile(preSignedUrl: string, file: File): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'text/csv' // Set the content type based on the file type
    });

    return this.httpClient.put(preSignedUrl, file, { headers }).pipe(
      catchError(error => {
        console.error('Error uploading file:', error);
        return throwError(error);
      })
    );
  }
}
