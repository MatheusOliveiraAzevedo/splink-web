import { Component, HostBinding, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactFormService } from '../../shared/services/contact-form.service';

@Component({
  selector: 'app-work-with-us',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './work-with-us.component.html',
  styleUrl: './work-with-us.component.scss'
})
export class WorkWithUsComponent implements OnInit {


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private contactForm: ContactFormService
  ) {}

  @HostBinding('class') class = 'd-flex flex-column align-items-center py-6 px-5'
  textObservation: string = ''
  formWork: FormGroup
  fileImage: File

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm() {
    this.formWork = this.fb.group({
      nome: ['', Validators.compose([
        Validators.required
      ])],
      tel: ['', Validators.compose([
        Validators.required
      ])],
      endereco: ['', Validators.compose([
        Validators.required
      ])],
      curriculo: [null, Validators.compose([
      ])],
      obs: ['', Validators.compose([
        Validators.required
      ])],
    })
  }
  
  send() {
    console.log(this.formWork.value)
    if (this.formWork.status === 'VALID') {

      if (this.fileImage) {
        const formData = new FormData();
        formData.append('curriculo', this.fileImage, this.fileImage.name);
        formData.append('endereco', this.formWork.get('endereco')?.value || '');
        formData.append('nome', this.formWork.get('nome')?.value || '');
        formData.append('obs', this.formWork.get('obs')?.value || '');
        formData.append('tel', this.formWork.get('tel')?.value || '');
        this.contactForm.sendFormContact(formData).then((res) => {
          console.log(res)
          console.log('enviou')
        }).catch((err) => {
          console.log(err)
        })
      }


    } else {
      this.formWork.markAllAsTouched();
    }
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.fileImage = input.files[0];
    }
  }

  backPage() {
    this.router.navigate(['/home'])
  }

}
