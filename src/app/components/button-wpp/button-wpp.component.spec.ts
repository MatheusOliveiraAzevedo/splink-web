import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonWppComponent } from './button-wpp.component';

describe('ButtonWppComponent', () => {
  let component: ButtonWppComponent;
  let fixture: ComponentFixture<ButtonWppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonWppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonWppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
