import { SearchValues } from '../components/generic/search.service';
export enum ProductEnum {
  _id = '_id',
  nombre = 'nombre',
  descripcion = 'descripcion',
  precio = 'precio',
}

export interface Product extends PouchDB.Core.PutDocument<{}>, SearchValues {
  [ProductEnum._id]: string;
  [ProductEnum.nombre]: string;
  [ProductEnum.descripcion]: string;
  [ProductEnum.precio]: number;
}
