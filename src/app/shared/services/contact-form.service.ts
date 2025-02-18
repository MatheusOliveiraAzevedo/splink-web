import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactFormService {

  private API = 'https://script.google.com/macros/s/AKfycby57qSW3tbfiu5ko4D3j6fxj1nDGyrx3-X3EKZ8SquRbOYZOa1SrfKT8v4L-1ldcVU9pQ/exec'

  constructor(
    private http: HttpClient,
  ) { }

  sendFormContact(image): Promise<any>{
    return this.http.post(this.API, image, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'json'
    }).toPromise();
  }

}
