import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEmpresasComponent } from './registro-empresas.component';

describe('RegistroEmpresasComponent', () => {
  let component: RegistroEmpresasComponent;
  let fixture: ComponentFixture<RegistroEmpresasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroEmpresasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroEmpresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
