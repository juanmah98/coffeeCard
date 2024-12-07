import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectorQrUsuarioComponent } from './lector-qr-usuario.component';

describe('LectorQrUsuarioComponent', () => {
  let component: LectorQrUsuarioComponent;
  let fixture: ComponentFixture<LectorQrUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LectorQrUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LectorQrUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
