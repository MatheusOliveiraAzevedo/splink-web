import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonAttentionComponent } from './button-attention.component';

describe('ButtonAttentionComponent', () => {
  let component: ButtonAttentionComponent;
  let fixture: ComponentFixture<ButtonAttentionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonAttentionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonAttentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
