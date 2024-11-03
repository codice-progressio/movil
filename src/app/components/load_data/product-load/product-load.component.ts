import { Component } from '@angular/core';
import {
  UploadDataComponent,
  UploadDataToImplement,
} from '../upload-data/upload-data.component';
import { Product, ProductEnum } from '../../../models/product.model';
import { ProductsService } from '../../../services/products.service';
import { LoadDataService } from '../load-data.service';

@Component({
  selector: 'app-product-load',
  standalone: true,
  imports: [UploadDataComponent],
  templateUrl: './product-load.component.html',
  styleUrl: './product-load.component.css',
})
export class ProductLoadComponent implements UploadDataToImplement<Product> {
  constructor(public products_service: ProductsService) {
    this.load_data_service = this.products_service;
  }

  valid_headers: string[] = Object.keys(ProductEnum);
  load_data_service: LoadDataService<Product>;
}
