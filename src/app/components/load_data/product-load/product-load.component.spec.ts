import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLoadComponent } from './product-load.component';

describe('ProductLoadComponent', () => {
  let component: ProductLoadComponent;
  let fixture: ComponentFixture<ProductLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductLoadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
