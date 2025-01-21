import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactFormService {

  private API = 'https://sp-link.com.br/wp-json/contact-form-7/v1/contact-forms/64/feedback'

  constructor(
    private http: HttpClient,
  ) { }

  sendFormContact(image): Promise<any>{
    return this.http.post(this.API, image).toPromise();
  }

}
