import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderFormComponent } from './sale-order-form.component';

describe('SaleOrderFormComponent', () => {
  let component: SaleOrderFormComponent;
  let fixture: ComponentFixture<SaleOrderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleOrderFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaleOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
