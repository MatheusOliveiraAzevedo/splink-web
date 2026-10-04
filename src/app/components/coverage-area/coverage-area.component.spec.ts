import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoverageAreaComponent } from './coverage-area.component';

describe('CoverageAreaComponent', () => {
  let component: CoverageAreaComponent;
  let fixture: ComponentFixture<CoverageAreaComponent>;
  const address = {
    city: 'Imbé', neighborhood: 'Bairro de teste', street: 'Rua de teste',
    number: '209', complement: 'Loja 03', contact: '(51) 99999-0000',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CoverageAreaComponent] }).compileComponents();
    fixture = TestBed.createComponent(CoverageAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('requires the complete address and a valid return contact before opening WhatsApp', () => {
    const open = spyOn(window, 'open');
    component.submit();
    expect(open).not.toHaveBeenCalled();
    component.form.patchValue({ ...address, street: '   ', contact: 'invalid' });
    component.submit();
    expect(open).not.toHaveBeenCalled();
    expect(component.invalid('street')).toBeTrue();
    expect(component.invalid('contact')).toBeTrue();
  });

  it('encodes all address fields and asks the team to confirm feasibility', () => {
    const open = spyOn(window, 'open');
    const prepared = spyOn(component.generalUtils, 'registrarFormularioPreparado');
    const click = spyOn(component.generalUtils, 'registrarCliqueWhatsApp');
    const sent = spyOn(component.generalUtils, 'registrarFormularioEnviado');
    component.form.patchValue(address);
    component.submit();
    const message = new URL(open.calls.mostRecent().args[0] as string).searchParams.get('text')!;
    for (const value of Object.values(address)) { expect(message).toContain(value); }
    expect(message).toContain('Aguardo a confirmação de viabilidade pela equipe');
    expect(prepared).toHaveBeenCalledOnceWith('coverage');
    expect(click).toHaveBeenCalledOnceWith({ position: 'coverage_form', intent: 'coverage' });
    expect(sent).not.toHaveBeenCalled();
    expect(component.form.controls.city.value).toBe('');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Confira a mensagem e toque em');
  });

  it('accepts email, an address without a number and an optional complement', () => {
    spyOn(window, 'open');
    component.form.patchValue({ ...address, number: 's/n', complement: '', contact: 'pessoa@example.com' });
    component.submit();
    expect(component.whatsappUrl).toBeTruthy();
    expect(decodeURIComponent(component.whatsappUrl)).not.toContain('Complemento:');
  });

  it('accepts expansion interest in another city without promising a date or service', () => {
    spyOn(window, 'open');
    component.form.patchValue({ ...address, city: 'Outra cidade', intent: 'expansion' });
    component.submit();
    expect(component.whatsappUrl).toBeTruthy();
    const message = decodeURIComponent(component.whatsappUrl);
    expect(message).toContain('cadastrar meu interesse');
    expect(message).toContain('não garante atendimento nem prazo de expansão');
  });

  it('clears the prepared message when the address changes', () => {
    spyOn(window, 'open');
    component.form.patchValue(address);
    component.submit();
    expect(component.whatsappUrl).toBeTruthy();
    component.form.controls.number.setValue('210');
    expect(component.whatsappUrl).toBe('');
  });

  it('renders only the neighborhood names supplied by operations', () => {
    expect(fixture.nativeElement.textContent).toContain('Tramandaí');
    expect(fixture.nativeElement.textContent).toContain('Imbé');
    expect(fixture.nativeElement.querySelector('.coverage-city ul')).toBeNull();
    component.cities[0].neighborhoods = ['Bairro de teste'];
    try {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.coverage-city li').textContent).toContain('Bairro de teste');
    } finally {
      component.cities[0].neighborhoods = [];
    }
  });
});
