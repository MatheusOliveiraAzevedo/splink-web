import { fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { WorkWithUsComponent } from './work-with-us.component';

describe('WorkWithUsComponent confirmed submission tracking', () => {
  let component: WorkWithUsComponent;
  let send: jasmine.Spy;
  let toast: jasmine.Spy;

  beforeEach(() => {
    send = jasmine.createSpy('sendFormContact');
    toast = jasmine.createSpy('add');
    component = new WorkWithUsComponent({} as any, new FormBuilder(), { sendFormContact: send } as any, { add: toast } as any);
    component.ngOnInit();
    const file = new File(['test'], 'cv.txt');
    component.formWork.patchValue({ nome: 'Teste', tel: '51999990000', endereco: 'Endereço de teste', curriculo: file, iAgree: true });
    component.fileDocument = file;
    spyOn(component.generalUtils, 'registrarFormularioEnviado');
    spyOn(FileReader.prototype, 'readAsDataURL').and.callFake(function(this: FileReader) {
      Object.defineProperty(this, 'result', { value: 'data:text/plain;base64,dGVzdA==' });
      this.onload!(new ProgressEvent('load') as ProgressEvent<FileReader>);
    });
  });

  it('tracks exactly once after explicit API confirmation', fakeAsync(() => {
    send.and.returnValue(Promise.resolve({ success: true }));
    component.send();
    component.send();
    tick();
    expect(send).toHaveBeenCalledTimes(1);
    expect(component.generalUtils.registrarFormularioEnviado).toHaveBeenCalledTimes(1);
    expect(component.isLoading).toBeFalse();
  }));

  for (const response of [{ success: false }, {}, { status: 'error' }]) {
    it(`does not track an unconfirmed response ${JSON.stringify(response)}`, fakeAsync(() => {
      send.and.returnValue(Promise.resolve(response));
      component.send();
      tick();
      expect(component.generalUtils.registrarFormularioEnviado).not.toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'warn' }));
    }));
  }

  it('does not count HTTP 200 parsing errors as successful submissions', fakeAsync(() => {
    send.and.returnValue(Promise.reject({ status: 200 }));
    component.send();
    tick();
    expect(component.generalUtils.registrarFormularioEnviado).not.toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));
});
