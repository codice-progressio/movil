import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileExcel, faFloppyDisk } from '@fortawesome/free-regular-svg-icons';

import {
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ExcelService, TablePreview } from '../../../services/excel.service';
import { TableComponent } from '../../table/table.component';
import { NotificationService } from '../../../services/notification.service';
import { PartnerService } from '../../../services/partner.service';
import { Partner, PartnerEnum } from '../../../models/partner.model';
import { NavigationService } from '../../../services/navigation.service';
import {
  UploadDataComponent,
  UploadDataToImplement,
} from '../upload-data/upload-data.component';
import { LoadDataService } from '../load-data.service';
@Component({
  selector: 'app-partner-load',
  standalone: true,
  imports: [UploadDataComponent],
  templateUrl: './partner-load.component.html',
  styleUrl: './partner-load.component.css',
})
export class PartnerLoadComponent implements UploadDataToImplement<Partner> {
  constructor(public partner_service: PartnerService) {
    this.load_data_service = this.partner_service;
  }
  valid_headers: string[] = Object.keys(PartnerEnum);
  load_data_service: LoadDataService<Partner>;
}
