import { AfterViewInit, Component, HostBinding, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactFormService } from '../../shared/services/contact-form.service';
import { NgxMaskDirective } from 'ngx-mask';
import { Toast } from 'bootstrap';


@Component({
  selector: 'app-work-with-us',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './work-with-us.component.html',
  styleUrl: './work-with-us.component.scss'
})
export class WorkWithUsComponent implements OnInit, AfterViewInit {


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private contactForm: ContactFormService
  ) {}

  @HostBinding('class') class = 'd-flex flex-column align-items-center py-6 px-5'
  textObservation: string = ''
  formWork: FormGroup
  fileDocument: File
  isLoading: boolean = false
  toastTrigger
  toastLiveExample
  toastBootstrap
  colorToast: 'success' | 'danger' = 'success'
  textToast: string

  ngOnInit(): void {
    this.loadForm();
  }

  ngAfterViewInit(): void {
    this.toastTrigger = document.getElementById('liveToastBtn');
    this.toastLiveExample = document.getElementById('liveToast');

    if (this.toastTrigger && this.toastLiveExample) {
      this.toastBootstrap = new Toast(this.toastLiveExample);

      this.toastTrigger.addEventListener('click', () => {
        this.toastBootstrap.show();
      });
    }
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
        Validators.required
      ])],
      obs: ['', Validators.compose([
      ])],
    })
  }
  
  send() {
    if (this.formWork.status === 'VALID' && this.fileDocument) {
      this.isLoading = true
      
      const reader = new FileReader();
      reader.readAsDataURL(this.fileDocument)
      reader.onload = () => {
        const base64String = reader.result?.toString().split(",")[1];
        
        const data = {
          "nome": this.formWork.get('nome').value,
          "tel": this.formWork.get('tel').value,
          "endereco": this.formWork.get('endereco').value,
          "curriculo": base64String,
          "fileName": this.fileDocument.name,
          "fileType": this.fileDocument.type,
          "obs": this.formWork.get('obs').value
        }
        
        
        this.contactForm.sendFormContact(data).then((res) => {
          console.log(res)
          console.log('enviou')
          this.isLoading = false
          this.textToast = 'Enviado com sucesso!'
          this.colorToast = 'success'
          this.toastBootstrap.show();
        }).catch((err) => {
          this.textToast = 'Houve um erro! Tente novamente!'
          this.colorToast = 'danger'
          this.toastBootstrap.show();
          this.isLoading = false
          console.log(err)
        })
      }
      
    } else {
      this.formWork.markAllAsTouched();
      this.textToast = 'Preencha os campos obrigatórios!'
      this.colorToast = 'danger'
      this.toastBootstrap.show();
    }
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.fileDocument = input.files[0];
    }
  }

  backPage() {
    this.router.navigate(['/home'])
  }

}
