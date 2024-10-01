import * as PouchDB from 'pouchdb';

export enum PartnerEnum {
  _id = '_id',
  nombre = 'nombre',
  apellido = 'apellido',
  domicilio = 'domicilio',
}

export interface Partner extends PouchDB.Core.PutDocument<{}> {
  [PartnerEnum._id]: string;
  [PartnerEnum.nombre]: string;
  [PartnerEnum.apellido]: string;
  [PartnerEnum.domicilio]: string;
}
