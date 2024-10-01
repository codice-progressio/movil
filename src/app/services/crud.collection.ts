import { Injectable, signal } from '@angular/core';
import * as PouchDBFind from 'pouchdb-find';
import { from } from 'rxjs';

import PouchDB from 'pouchdb';
import { Partner } from '../models/partner.model';

/**
 * This class is a wrapper for PouchDB.
 * It is used to create a collection in PouchDB.
 *
 */
export class Collection<T> {
  collection_name: string;
  db: PouchDB.Database;

  constructor(collection_name: string) {
    this.collection_name = collection_name;
    this.db = new PouchDB(this.collection_name);
  }

  // Begins of the crud operations
  create(data: PouchDB.Core.PutDocument<{} & T>) {
    return from(this.db.put<T>(data));
  }

  read(id: string) {
    return from(this.db.get<T>(id));
  }

  read_all() {
    return from(this.db.allDocs<T>({ include_docs: true }));
  }

  update(data: PouchDB.Core.PutDocument<{} & T>) {
    return this.create(data);
  }

  delete(id: string) {
    return from(this.db.remove({ _id: id } as PouchDB.Core.RemoveDocument));
  }

  bulk(data: PouchDB.Core.PutDocument<{} & T>[]) {
    return from(this.db.bulkDocs<T>(data));
  }
}
