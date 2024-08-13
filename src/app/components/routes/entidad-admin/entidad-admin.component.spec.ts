import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntidadAdminComponent } from './entidad-admin.component';

describe('EntidadAdminComponent', () => {
  let component: EntidadAdminComponent;
  let fixture: ComponentFixture<EntidadAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntidadAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntidadAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
