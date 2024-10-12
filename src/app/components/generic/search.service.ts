import { Injectable } from '@angular/core';
import { SearchComponent } from './search/search.component';
import { Collection } from '../../services/crud.collection';
import { from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private register_components: SearchRegisterComponent<any>[] = [];

  register<TModel extends SearchValues>(
    component: SearchComponent<TModel>,
    db: Collection<TModel>
  ) {
    const component_resgister = new SearchRegisterComponent<TModel>(
      component,
      db
    );
    this.register_components.push(component_resgister);
    return component_resgister;
  }

  search<TModel>(term: string, component: SearchComponent<TModel>) {
    const terms = term.trim().toLowerCase().split(' ');

    const register = this.register_components.find(
      (register) => register.component.id === component.id
    );

    if (!register) return from([]);
    return register.db.search_term(terms).pipe(
      map((res) => {
        const search_results: SearchResults<TModel>[] = [];
        for (const result of res) {
          const search_result = new SearchResults<TModel>();
          search_result.display_name = register.db.display_name(
            result as TModel
          );
          search_result.results.push(result as TModel);
          search_results.push(search_result);
        }
        return search_results;
      })
    );
  }
}

export class SearchResults<T> {
  display_name: string[] = [];
  results: T[] = [];
}

export class SearchRegisterComponent<TModel extends SearchValues> {
  component: SearchComponent<TModel>;
  db: Collection<TModel>;

  constructor(component: SearchComponent<TModel>, db: Collection<TModel>) {
    this.component = component;
    this.db = db;
  }
}

/**
 * Interface that represents the values that can be searched in a document.
 */
export interface SearchValues {
  search_field: string;
}
