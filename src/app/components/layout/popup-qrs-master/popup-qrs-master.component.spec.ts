import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupQrsMasterComponent } from './popup-qrs-master.component';

describe('PopupQrsMasterComponent', () => {
  let component: PopupQrsMasterComponent;
  let fixture: ComponentFixture<PopupQrsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupQrsMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupQrsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
