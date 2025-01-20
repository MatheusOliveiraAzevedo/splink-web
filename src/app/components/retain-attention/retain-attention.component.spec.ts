import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetainAttentionComponent } from './retain-attention.component';

describe('RetainAttentionComponent', () => {
  let component: RetainAttentionComponent;
  let fixture: ComponentFixture<RetainAttentionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetainAttentionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetainAttentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
