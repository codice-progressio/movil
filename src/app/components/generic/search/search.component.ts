import { Component, input, signal } from '@angular/core';
import { Collection } from '../../../services/crud.collection';
import {
  SearchRegisterComponent,
  SearchResults,
  SearchService,
} from '../search.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { debounceTime, Observable, OperatorFunction, switchMap } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgbTypeaheadModule, FormsModule, JsonPipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent<T> {
  constructor(private search_service: SearchService) {}

  model: T | null = null;
  /**
   * The id of the search component for find
   * this component in the search service.
   *
   * @memberof SearchComponent
   */
  id = Math.random().toString(36).substring(7);
  title_search = input.required<string>();

  search: OperatorFunction<string, readonly SearchResults<T>[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      switchMap((term) => this.search_service.search<T>(term, this))
    );

  formatter = (x: { name: string }) => x.name;
}
