import { Injectable, signal } from '@angular/core';
import readXlsxFile, { Row } from 'read-excel-file';
import { Partner, PartnerEnum } from '../models/partner.model';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  partner_data_loaded = signal<TablePreview | undefined>(undefined);

  async load_partner(fileList: FileList | null) {
    console.log({ fileList });
    if (!fileList) return;

    const previewExcel = new TablePreview();
    await previewExcel.read(fileList[0], Object.keys(PartnerEnum));
    const data = previewExcel;
    this.partner_data_loaded.set(data);
  }
}

/**
 * Class representing a preview of an Excel file.
 *
 * @template Enum - A generic type representing an enumeration.
 */
export class TablePreview {
  constructor() {}
  /**
   * Indicates if the file is loading.
   * @type {boolean}
   */
  cargando: boolean = false;

  /**
   * An array containing all rows from the Excel file.
   * @type {Row[]}
   */
  all_rows: Row[] = [];

  /**
   * An object containing the data from the Excel file in object format.
   * @type {any}
   */
  data_object: any[] = [];

  /**
   * An array of valid header strings derived from the enumeration.
   * @type {string[]}
   */
  valid_headers: string[] = [];

  /**
   * A map for storing name properties.
   * @type {any}
   * @memberof PreviewExcel
   */
  map: any = {};
  headers: Row | undefined = undefined;

  /**
   * An error message.
   * @type {string}
   */
  error: string = '';

  /**
   * * Creates an instance of PreviewExcel.le   *
   * @param {File} file - The Excel file to be read.
   * @param {string[]} valid_headers - The enumeration to derive valid headers from.
   * @memberof PreviewExcel
   */
  async read(file: File, valid_headers: string[]) {
    this.valid_headers = valid_headers;
    if (!this.valid_headers.length)
      throw new Error('No headers provided for validation.');

    this.cargando = true;
    const rows = await readXlsxFile(file);
    this.headers = rows.shift();
    this.all_rows = rows;
    const all_headers_are_valid = this.validate_headers(this.headers);

    if (!all_headers_are_valid) {
      this.error = `El archivo no tiene los encabezados correctos. Deberia tener los siguientes: ${this.valid_headers.join(
        ', '
      )}`;
      console.error(this.error);
    }

    this.headers?.forEach((element) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.map[element as any] = element as string;
    });

    this.data_object = this.all_rows.map((row) => {
      const obj: any = {};
      row.forEach((element, index) => {
        obj[this.headers?.[index] as string] = element;
      });
      return obj;
    });

    this.cargando = false;
  }

  /**
   * Validates the provided headers against a predefined set of valid headers.
   *
   * @param headers - The headers to validate, represented as a Row or undefined.
   * @returns A boolean indicating whether all valid headers are present in the provided headers.
   */
  validate_headers(headers: Row | undefined) {
    if (!headers) return false;
    const headers_string = headers.map((header) => header.toString());
    return this.valid_headers.every((header) =>
      headers_string.includes(header)
    );
  }

  transform_generic_data<T extends Object>(data: T[], valid_headers: string[]) {
    const header_acumulator = [];
    for (const header of valid_headers) {
      if (header in data[0]) header_acumulator.push(header);
    }
    this.headers = header_acumulator as Row;

    this.all_rows = data
      .map((obj) => {
        const acumulator = [];
        type ObjectKey = keyof typeof obj;
        for (const header of valid_headers) {
          if (header in obj) acumulator.push(obj[header as ObjectKey]);
        }

        return acumulator as Row;
      })
      .sort((a, b) => (a[1] > b[1] ? 1 : -1));

    this.data_object = data;
    this.map = this.headers.reduce((acc, header: any) => {
      acc[header] = header;
      return acc;
    }, {} as any);
  }
}
