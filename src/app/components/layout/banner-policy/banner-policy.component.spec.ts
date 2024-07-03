import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerPolicyComponent } from './banner-policy.component';

describe('BannerPolicyComponent', () => {
  let component: BannerPolicyComponent;
  let fixture: ComponentFixture<BannerPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerPolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
