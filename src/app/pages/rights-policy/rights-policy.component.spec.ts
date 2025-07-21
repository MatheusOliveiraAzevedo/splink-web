import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightsPolicyComponent } from './rights-policy.component';

describe('RightsPolicyComponent', () => {
  let component: RightsPolicyComponent;
  let fixture: ComponentFixture<RightsPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightsPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RightsPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
