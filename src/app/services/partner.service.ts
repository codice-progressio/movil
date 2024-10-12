import { Injectable } from '@angular/core';
import { Partner, PartnerEnum } from '../models/partner.model';
import { Collection } from './crud.collection';
import { SearchValues } from '../components/generic/search.service';

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  db: Collection<Partner>;
  constructor() {
    this.db = new CollectionPartner<Partner>('partner');
  }
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
