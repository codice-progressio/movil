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
import { NotificationService } from '../../services/notification.service';
import { PartnerService } from '../../services/partner.service';
import { Partner } from '../../models/partner.model';
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
  constructor(
    public excel_service: ExcelService,
    private noti_service: NotificationService,
    private partner_service: PartnerService
  ) {}

  excel = faFileExcel;
  save = faFloppyDisk;

  load_file(files: FileList | null) {
    this.excel_service.load_partner(files);
  }

  save_new_contacts() {
    this.noti_service
      .confirmation('¿Desea guardar los nuevos contactos?')
      .subscribe((res) => {
        if (res.isConfirmed) {
          let data = this.excel_service.partner_data_loaded()
            ?.data_object as Partner[];
          data = data.map((contact) => {
            return { ...contact, _id: contact._id.toString() };
          });

          this.partner_service.db.bulk(data).subscribe(() => {
            this.noti_service.success('Contactos guardados', '');
          });
        }
        if (res.isDenied) this.noti_service.info('Operación cancelada', '');
      });
  }
}
