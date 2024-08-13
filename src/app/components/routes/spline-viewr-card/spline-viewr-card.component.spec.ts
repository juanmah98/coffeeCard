import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplineViewrCardComponent } from './spline-viewr-card.component';

describe('SplineViewrCardComponent', () => {
  let component: SplineViewrCardComponent;
  let fixture: ComponentFixture<SplineViewrCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SplineViewrCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplineViewrCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
