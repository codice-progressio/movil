import { Injectable, signal } from '@angular/core';
import readXlsxFile, { Row } from 'read-excel-file';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
  
})
export class ExcelService {
  constructor(private datePipe: DatePipe) {}

  data_loaded = signal<TablePreview | undefined>(undefined);

  async load_data(fileList: FileList | null, valid_headers: string[]) {
    if (!fileList) return;

    const previewExcel = new TablePreview();
    await previewExcel.read(fileList[0], valid_headers);
    const data = previewExcel;
    return data;
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  _generate_name(fileName: string): string {
    let fecha = this.datePipe.transform(new Date(), 'yyyy_MM_dd_HH_mm');

    return `${fileName}_EXPORTADO_${fecha}${EXCEL_EXTENSION}`;
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, this._generate_name(fileName));
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

  /**
   * Transforms generic data by filtering and sorting based on valid headers.
   *
   * @template T - The type of objects in the data array.
   * @param {T[]} data - The array of data objects to be transformed.
   * @param {string[]} valid_headers - The list of headers to be considered valid.
   *
   * @returns {void} This function does not return a value. It modifies the instance properties:
   * - `this.headers`: An array of valid headers found in the data.
   * - `this.all_rows`: A sorted array of rows, each row containing values corresponding to the valid headers.
   * - `this.data_object`: The original data array.
   * - `this.map`: An object mapping each valid header to itself.
   */
  transform_generic_data<T extends Object>(
    data: T[],
    valid_headers: string[],
    sort_index_column = 1,
    reverse_sort = false
  ) {
    if (data.length === 0) return;

    const header_acumulator = [];
    for (const header of valid_headers) {
      if (header in data[0]) header_acumulator.push(header);
    }
    this.headers = header_acumulator as Row;

    const sort_direction = reverse_sort ? -1 : 1;

    this.all_rows = data
      .map((obj) => {
        const acumulator = [];
        type ObjectKey = keyof typeof obj;
        for (const header of valid_headers) {
          if (header in obj) acumulator.push(obj[header as ObjectKey]);
        }

        return acumulator as Row;
      })
      .sort((a, b) =>
        a[sort_index_column] > b[sort_index_column]
          ? 1 * sort_direction
          : -1 * sort_direction
      );

    this.data_object = data;
    this.map = this.headers.reduce((acc, header: any) => {
      acc[header] = header;
      return acc;
    }, {} as any);
  }
}
