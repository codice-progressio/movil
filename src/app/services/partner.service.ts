import { Injectable } from '@angular/core';
import { Partner, PartnerEnum } from '../models/partner.model';
import { Collection } from './crud.collection';
import { SearchValues } from '../components/generic/search.service';
import { LoadDataService } from '../components/load_data/load-data.service';
import { GLOBAL_ROUTES } from './navigation.service';

@Injectable({
  providedIn: 'root',
})
export class PartnerService extends LoadDataService<Partner> {
  override db = new CollectionPartner<Partner>('partner');
  override navigate_after_load: GLOBAL_ROUTES = GLOBAL_ROUTES.partner_load;
}

class CollectionPartner<T extends SearchValues> extends Collection<T> {
  override search_field(element: T): T {
    const datas = element as unknown as Partner;
    element.search_field = [
      datas[PartnerEnum.nombre],
      datas[PartnerEnum.apellido],
      datas[PartnerEnum.domicilio],
    ].join(' ');

    return element;
  }

  override display_name(data: T): string[] {
    const datas = data as unknown as Partner;
    return [
      datas[PartnerEnum.nombre] + ' ' + datas[PartnerEnum.apellido],
      datas[PartnerEnum.domicilio],
    ];
  }
}
