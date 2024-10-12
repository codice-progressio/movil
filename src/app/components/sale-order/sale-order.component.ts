import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { PartnerService } from '../../services/partner.service';
import { Partner } from '../../models/partner.model';
import { SearchComponent } from '../generic/search/search.component';
import {
  SearchRegisterComponent,
  SearchService,
} from '../generic/search.service';

@Component({
  selector: 'app-sale-order',
  standalone: true,
  imports: [SearchComponent],
  templateUrl: './sale-order.component.html',
  styleUrl: './sale-order.component.css',
})
export class SaleOrderComponent implements AfterViewInit {
  @ViewChild(SearchComponent) search_component!: SearchComponent<Partner>;

  search_result: Partner[] = [];

  
  constructor(
    private partner_service: PartnerService,
    private search_service: SearchService
  ) { }
  

  ngAfterViewInit(): void {
    this.search_service.register(
      this.search_component,
      this.partner_service.db
    );
  }
}
