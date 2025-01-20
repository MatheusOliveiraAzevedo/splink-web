import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtomFooterComponent } from './buttom-footer.component';

describe('ButtomFooterComponent', () => {
  let component: ButtomFooterComponent;
  let fixture: ComponentFixture<ButtomFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtomFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtomFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
