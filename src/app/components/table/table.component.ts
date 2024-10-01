import { CommonModule } from '@angular/common';
import { Component, effect, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ExcelService, TablePreview } from '../../services/excel.service';
import { Row } from 'read-excel-file';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPaginationModule, NgbTypeaheadModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  constructor() {
    effect(() => {
      const preview_excel = this.data();
      if (preview_excel) {
        this.data_buffer = preview_excel.all_rows || [];
        this.refresh(preview_excel.all_rows);
      }
    });
  }

  page = 1;
  items_per_page = [10, 50, 100];
  pageSize = this.items_per_page[0];
  data = input<TablePreview | undefined>();
  data_buffer: Row[] = [];
  data_view: Row[] = [];
  collection_size = 0;

  refresh(_rows: Row[] = []) {
    const rows = _rows;
    this.data_view = rows.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );

    this.collection_size = rows.length;
  }
}
