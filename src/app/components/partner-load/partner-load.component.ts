import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileExcel, faFloppyDisk } from '@fortawesome/free-regular-svg-icons';

import {
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ExcelService } from '../../services/excel.service';
import { TableComponent } from '../table/table.component';
@Component({
  selector: 'app-partner-load',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    TableComponent,
  ],
  templateUrl: './partner-load.component.html',
  styleUrl: './partner-load.component.css',
})
export class PartnerLoadComponent {
  constructor(public excel_service: ExcelService) {}

  excel = faFileExcel;
  save = faFloppyDisk;

  load_file(files: FileList | null) {
    this.excel_service.load_partner(files);
  }
}
