import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SumarQrComponent } from './sumar-qr.component';

describe('SumarQrComponent', () => {
  let component: SumarQrComponent;
  let fixture: ComponentFixture<SumarQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SumarQrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SumarQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
