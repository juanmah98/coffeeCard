import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneradorQrsComponent } from './generador-qrs.component';

describe('GeneradorQrsComponent', () => {
  let component: GeneradorQrsComponent;
  let fixture: ComponentFixture<GeneradorQrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneradorQrsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneradorQrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
