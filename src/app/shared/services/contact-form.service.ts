import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactFormService {

  private API = 'https://script.google.com/macros/s/AKfycbzlnf0cCKc-74ouPZ1xRT_3HqpxDgmMygVatuxv0OFzeXcBMsorbJw6AaGdvT2N8eIl/exec'

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
