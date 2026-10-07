import { Component, HostBinding, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactFormService } from '../../shared/services/contact-form.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { GeneralUtils } from '../../shared/generalutils';


@Component({
  selector: 'app-work-with-us',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgxMaskDirective, ToastModule],
  providers: [MessageService, provideNgxMask()],
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

  @HostBinding('class') class = 'd-flex justify-content-center'
  generalUtils = new GeneralUtils();
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
      iAgree: [false, Validators.requiredTrue],
    })
  }

  showToast(sumary: string, detail: string, severity: string) {
    this.messageService.add({ severity: severity, summary: sumary, detail: detail, key: 'br', life: 3000 });
  }

  send() {
    if (this.isLoading) return;
    this.showErrorIAgree = this.formWork.get('iAgree').invalid;
    if (this.formWork.valid && this.fileDocument) {
      this.isLoading = true
      
      const reader = new FileReader();
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
        
        
        this.contactForm.sendFormContact(data).then((response) => {
          this.isLoading = false;
          if (response?.success === true || response?.status === 'success') {
            this.generalUtils.registrarFormularioEnviado();
            this.showToast('Concluído', 'Enviado com sucesso!', 'success');
          } else {
            this.showToast('Envio não confirmado', 'Não foi possível confirmar o recebimento. Entre em contato com a equipe antes de reenviar.', 'warn');
          }
        }).catch(() => {
          this.isLoading = false;
          this.showToast('Envio não confirmado', 'Não foi possível confirmar o recebimento. Entre em contato com a equipe antes de reenviar.', 'warn');
        });
      };
      reader.onerror = () => {
        this.isLoading = false;
        this.showToast('Erro no arquivo', 'Não foi possível ler o currículo. Selecione o arquivo novamente.', 'error');
      };
      reader.readAsDataURL(this.fileDocument);
    } else {
      this.formWork.markAllAsTouched();
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
