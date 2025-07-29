import { Component, HostBinding, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactFormService } from '../../shared/services/contact-form.service';
import { NgxMaskDirective } from 'ngx-mask';
import { Toast } from 'bootstrap';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-work-with-us',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgxMaskDirective, ToastModule],
  providers: [MessageService],
  templateUrl: './work-with-us.component.html',
  styleUrl: './work-with-us.component.scss'
})
export class WorkWithUsComponent implements OnInit {


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private contactForm: ContactFormService,
    private messageService: MessageService
  ) {}

  @HostBinding('class') class = 'd-flex flex-column align-items-center py-6 px-5'
  textObservation: string = ''
  formWork: FormGroup
  fileDocument: File
  isLoading: boolean = false
  toastTrigger
  toastLiveExample
  showErrorIAgree: boolean = false

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
        Validators.required
      ])],
      obs: ['', Validators.compose([
      ])],
      iAgree: [false, Validators.compose([
      ])],
    })
  }

  showToast(sumary: string, detail: string, severity: string) {
    this.messageService.add({ severity: severity, summary: sumary, detail: detail, key: 'br', life: 3000 });
  }

  send() {
    if (this.formWork.status === 'VALID' && this.fileDocument && !this.showErrorIAgree) {
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
        
        
        this.contactForm.sendFormContact(data).then(() => {
          this.isLoading = false
          this.showToast('Concluido', 'Enviado com sucesso!', 'success');
        }).catch((err) => {
          if (err.status === 200) {
            this.showToast('Concluido', 'Enviado com sucesso!', 'success');
            this.isLoading = false
          } else {
            this.showToast('Houve um erro!', 'Tente novamente!', 'error');
            this.isLoading = false
          }
        })
      }
      
    } else {
      this.formWork.markAllAsTouched();
      this.showErrorIAgree = true
      this.showToast('Campos vazios!', 'Preencha os campos obrigatórios!', 'warn');
    }
  }

  changeStatusAgree() {
    this.showErrorIAgree = !this.formWork.get('iAgree').value
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
