import { Injectable } from '@angular/core';
import { Product, ProductEnum } from '../models/product.model';
import { Collection } from './crud.collection';
import { LoadDataService } from '../components/load_data/load-data.service';
import { GLOBAL_ROUTES } from './navigation.service';
import { SearchValues } from '../components/generic/search.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends LoadDataService<Product> {
  override db = new CollectionProduct<Product>('product');
  override navigate_after_load: GLOBAL_ROUTES = GLOBAL_ROUTES.product_load;
}

class CollectionProduct<T extends SearchValues> extends Collection<T> {
  override search_field(element: T): T {
    const datas = element as unknown as Product;

    element.search_field = [
      datas[ProductEnum.nombre],
      datas[ProductEnum.descripcion],
    ].join(' ');
    return element;
  }

  override display_name(data: T): string[] {
    const datas = data as unknown as Product;
    return [datas[ProductEnum.nombre]];
  }
}
