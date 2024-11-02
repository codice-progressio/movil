import { Injectable, signal } from '@angular/core';
import { from, map, Observable, of } from 'rxjs';

import PouchFind from 'pouchdb-find';
import PouchDB from 'pouchdb';
PouchDB.plugin(PouchFind);
import { Partner } from '../models/partner.model';
import { SearchValues } from '../components/generic/search.service';

/**
 * This class is a wrapper for PouchDB.
 * It is used to create a collection in PouchDB.
 *
 */
export class Collection<T extends SearchValues> {
  collection_name: string;
  db: PouchDB.Database;
  buffer: T[] = [];

  constructor(collection_name: string) {
    this.collection_name = collection_name;
    this.db = new PouchDB(this.collection_name);
    this._load_buffer();
  }

  // Begins of the crud operations
  create(data: PouchDB.Core.PutDocument<{} & T>) {
    return of(this.db.put<T>(data));
  }

  read(id: string) {
    return of(this.db.get<T>(id));
  }

  read_all() {
    return from(this.db.allDocs<T>({ include_docs: true }));
  }

  search_field(element: T): T {
    throw new Error('Method not implemented.');
  }

  _clean_for_search(element: T): T {
    element.search_field = (element.search_field ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(
        /([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,
        '$1'
      )
      .normalize();
    return element;
  }

  _load_buffer() {
    this.read_all().subscribe((res) => {
      this.buffer = res.rows
        .map((row) => row.doc as T)
        .map((element) => this.search_field(element))
        .map((element) => this._clean_for_search(element));
      console.log(this.db.name + 'buffer loaded');
    });
  }

  /**
   * Searches for documents in the database that match any of the given terms.
   *
   * @param terms - An array of strings representing the search terms.
   * @returns An observable that emits the search results.
   */
  search_term(terms: string[]) {
    if (this.buffer.length === 0) {
      this._load_buffer();
      return of([]);
    }
    if (terms.length === 0) {
      return of([]);
    }

    const results: T[] = [];

    for (const term of terms) {
      const result = this.buffer.filter((element) => {
        return (element.search_field ?? '').includes(term);
      });

      results.push(...result);
    }

    // Remove duplicates
    const unique_results = results
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      })
      .sort((a, b) =>
        (a.search_field ?? '').localeCompare(b.search_field ?? '')
      )
      .slice(0, 10);

    return of(unique_results);
  }

  update(data: PouchDB.Core.PutDocument<{} & T>) {
    return this.create(data);
  }

  delete(id: string) {
    return of(this.db.remove({ _id: id } as PouchDB.Core.RemoveDocument));
  }

  bulk(data: PouchDB.Core.PutDocument<{} & T>[]) {
    return of(this.db.bulkDocs<T>(data));
  }

  /**
   * Generates a display name for the given data.
   *
   * @param data - The data for which to generate a display name.
   * @returns An array string representing the display name. Each element per line. Max 3 lines.
   * @throws An error if the method is not implemented.
   */
  display_name(data: T): string[] {
    throw new Error('Method not implemented.');
  }
}

export interface $OrRegex {
  [key: string]: { $regex: string };
}
