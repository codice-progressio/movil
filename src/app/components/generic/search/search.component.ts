import {
  AfterViewInit,
  Component,
  effect,
  input,
  output,
  Renderer2,
  signal,
} from '@angular/core';
import { Collection } from '../../../services/crud.collection';
import {
  SearchRegisterComponent,
  SearchResults,
  SearchService,
  SearchValues,
} from '../search.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { debounceTime, Observable, OperatorFunction, switchMap } from 'rxjs';

/**
 * A generic search component that provides typeahead functionality.
 * To initialize this component, you must provide a search service
 * in the father component and register this component in the search service. Note the view child. 
 *
 * Example:
 * ```typescript
 @Component({
  selector: 'app-sale-order',
  standalone: true,
  imports: [SearchComponent, SaleOrderFormComponent],
  templateUrl: './sale-order.component.html',
  styleUrl: './sale-order.component.css',
})
export class SaleOrderComponent implements AfterViewInit {
  @ViewChild(SearchComponent) search_component!: SearchComponent<Partner>;

  constructor(
    private partner_service: PartnerService,
    private search_service: SearchService,
    public sale_order_service: SaleOrderService
  ) {}

  ngAfterViewInit(): void {
    this.search_service.register(
      this.search_component,
      this.partner_service.db
    );
  }
}
* ``` 
 *
 * @template T - The type of the model used in the search component.
 *
 * @implements {AfterViewInit}
 */
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgbTypeaheadModule, FormsModule, JsonPipe, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent<T, TSearchValue extends SearchValues>
  implements AfterViewInit
{
  constructor(private search_service: SearchService) {
    effect(() => {
      this.search_service.register<SearchValues>(this as any, this.db());
    });
  }

  private _model: T | null = null;
  public get model(): T | null {
    return this._model;
  }

  db = input.required<Collection<TSearchValue>>();
  class_icon = input<string>('fa-arrow-circle-right');

  ngAfterViewInit(): void {
    const id = 'typeahead-template';
    const input = document.getElementById(id) as HTMLInputElement;
    input.focus();
  }

  public set model(value: T | null) {
    this._model = value;
    this.selected.emit(value);
  }

  selected = output<T | null>();

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
      switchMap((term) =>
        this.search_service.search<T, TSearchValue>(term, this)
      )
    );

  formatter = (x: { name: string }) => x.name;
}
