import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupScanerqrComponent } from './popup-scanerqr.component';

describe('PopupScanerqrComponent', () => {
  let component: PopupScanerqrComponent;
  let fixture: ComponentFixture<PopupScanerqrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupScanerqrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupScanerqrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
