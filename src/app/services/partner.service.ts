import { Injectable } from '@angular/core';
import { Partner } from '../models/partner.model';
import { Collection } from './crud.collection';

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  db: Collection<Partner> = new Collection<Partner>('partner');
  constructor() {}
}
