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
    private navigation_service: NavigationService,
    public excel_service: ExcelService,
    private noti_service: NotificationService,
    public partner_service: PartnerService
  ) {
    this.partner_service.db.read_all().subscribe((res) => {
      const data = res.rows.map((row) => row.doc as Partner);
      this.all_data = new TablePreview();
      this.all_data.transform_generic_data(data, Object.keys(PartnerEnum));
    });
  }

  all_data: TablePreview | undefined = undefined;
  excel = faFileExcel;
  save = faFloppyDisk;

  load_file(files: FileList | null) {
    // this.excel_service.load_data(files);
  }

  save_new_contacts() {
    this.noti_service
      .confirmation('¿Desea guardar los nuevos contactos?')
      .subscribe((res) => {
        if (res.isConfirmed) {
          let data = this.excel_service.data_loaded()?.data_object as Partner[];
          data = data.map((contact) => {
            return { ...contact, _id: contact._id.toString() };
          });

          this.partner_service.db.bulk(data).subscribe(() => {
            this.noti_service.success('Contactos guardados', '');

            this.navigation_service.sale_order();
          });
        }
        if (res.isDenied) this.noti_service.info('Operación cancelada', '');
      });
  }
}
