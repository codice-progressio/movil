import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerLoadComponent } from './partner-load.component';

describe('PartnerLoadComponent', () => {
  let component: PartnerLoadComponent;
  let fixture: ComponentFixture<PartnerLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerLoadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartnerLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
