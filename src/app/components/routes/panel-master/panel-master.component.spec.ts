import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelMasterComponent } from './panel-master.component';

describe('PanelMasterComponent', () => {
  let component: PanelMasterComponent;
  let fixture: ComponentFixture<PanelMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
