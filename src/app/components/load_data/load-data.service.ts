import { Injectable } from '@angular/core';
import { Collection } from '../../services/crud.collection';
import { SearchValues } from '../generic/search.service';
import { GLOBAL_ROUTES } from '../../services/navigation.service';

@Injectable({
  providedIn: 'root',
})
export abstract class LoadDataService<T extends SearchValues> {
  abstract db: Collection<T>;
  abstract navigate_after_load: GLOBAL_ROUTES;
}
