import { Component, DestroyRef, ElementRef, HostBinding, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { coverageCities } from '../../shared/model/coverage';
import { GeneralUtils, ContactIntent } from '../../shared/generalutils';

function nonBlank(control: AbstractControl): ValidationErrors | null {
  return typeof control.value === 'string' && control.value.trim() ? null : { required: true };
}

function returnContact(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value ?? '').trim();
  if (value.includes('@')) {
    return Validators.email({ value } as AbstractControl);
  }
  const digits = value.replace(/\D/g, '');
  const phone = /^[+\d\s().-]+$/.test(value)
    && /^(?:55)?[1-9]{2}\d{8,9}$/.test(digits);
  return phone ? null : { contact: true };
}

@Component({
  selector: 'app-coverage-area',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './coverage-area.component.html',
  styleUrl: './coverage-area.component.scss',
})
export class CoverageAreaComponent {
  @HostBinding('class') class = 'd-flex justify-content-center';
  readonly cities = coverageCities;
  private fb = inject(FormBuilder);
  private element = inject<ElementRef<HTMLElement>>(ElementRef);
  private destroyRef = inject(DestroyRef);
  submitted = false;
  whatsappUrl = '';
  generalUtils = new GeneralUtils();
  private preparedIntent: ContactIntent = 'coverage';

  readonly form = this.fb.nonNullable.group({
    intent: ['coverage', [Validators.required, Validators.pattern(/^(coverage|expansion)$/)]],
    city: ['', [nonBlank, Validators.maxLength(80)]],
    neighborhood: ['', [nonBlank, Validators.maxLength(100)]],
    street: ['', [nonBlank, Validators.maxLength(150)]],
    number: ['', [nonBlank, Validators.maxLength(20)]],
    complement: ['', Validators.maxLength(150)],
    contact: ['', [nonBlank, returnContact, Validators.maxLength(120)]],
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.whatsappUrl = '';
    });
  }

  invalid(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted);
  }

  submit(): void {
    this.submitted = true;
    this.whatsappUrl = '';
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.element.nativeElement.querySelector<HTMLElement>('input.ng-invalid, select.ng-invalid')?.focus();
      return;
    }
    const values = this.form.getRawValue();
    const message = [
      values.intent === 'expansion'
        ? 'Olá! Vim pelo site e quero cadastrar meu interesse em uma área de expansão da SP-Link.'
        : 'Olá! Vim pelo site e quero consultar a viabilidade de internet da SP-Link no meu endereço.',
      '',
      `Cidade: ${values.city.trim()}`,
      `Bairro: ${values.neighborhood.trim()}`,
      `Rua: ${values.street.trim()}`,
      `Número: ${values.number.trim()}`,
      ...(values.complement.trim() ? [`Complemento: ${values.complement.trim()}`] : []),
      `Contato para retorno: ${values.contact.trim()}`,
      '',
      values.intent === 'expansion'
        ? 'Aguardo avaliação da equipe. Estou ciente de que este interesse não garante atendimento nem prazo de expansão.'
        : 'Aguardo a confirmação de viabilidade pela equipe para este endereço.',
    ].join('\n');
    this.preparedIntent = values.intent as ContactIntent;
    this.generalUtils.registrarFormularioPreparado(this.preparedIntent);
    const url = this.generalUtils.abrirWhatsApp({ position: 'coverage_form', intent: this.preparedIntent }, message);
    this.form.reset(undefined, { emitEvent: false });
    this.submitted = false;
    this.whatsappUrl = url;
  }
}
