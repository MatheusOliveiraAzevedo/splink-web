import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselPlansComponent } from './carousel-plans.component';

describe('CarouselPlansComponent', () => {
  let component: CarouselPlansComponent;
  let fixture: ComponentFixture<CarouselPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselPlansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
