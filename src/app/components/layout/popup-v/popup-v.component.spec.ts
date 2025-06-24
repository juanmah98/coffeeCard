import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupVComponent } from './popup-v.component';

describe('PopupVComponent', () => {
  let component: PopupVComponent;
  let fixture: ComponentFixture<PopupVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupVComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
