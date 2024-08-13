import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupQrComponent } from './popup-qr.component';

describe('PopupQrComponent', () => {
  let component: PopupQrComponent;
  let fixture: ComponentFixture<PopupQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupQrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
