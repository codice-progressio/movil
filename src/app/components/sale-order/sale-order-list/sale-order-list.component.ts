import { Component } from '@angular/core';
import { SaleOrderService } from '../../../services/sale-order.service';
import { ExcelService, TablePreview } from '../../../services/excel.service';
import { SaleOrder, SaleOrderEnum } from '../../../models/sale-order.model';
import { TableComponent } from '../../table/table.component';
import {
  GLOBAL_ROUTES,
  NavigationService,
} from '../../../services/navigation.service';
import { Config } from '@fortawesome/fontawesome-svg-core';
import { ConfigurationService } from '../../../services/configuration.service';

@Component({
  selector: 'app-sale-order-list',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './sale-order-list.component.html',
  styleUrl: './sale-order-list.component.css',
})
export class SaleOrderListComponent {
  all_data: TablePreview | undefined;

  constructor(
    private sale_order_service: SaleOrderService,
    private navigation_service: NavigationService,
    private excel_service: ExcelService,
    private configuration_service: ConfigurationService
  ) {
    this.sale_order_service.db.read_all().subscribe((res) => {
      const data = res.rows.map((row) => row.doc as SaleOrder);
      this.all_data = new TablePreview();

      const headers_to_remove = [
        SaleOrderEnum.lines,
        SaleOrderEnum.partner_id,
        SaleOrderEnum.state,
      ];

      for (const doc of data) {
        const raw_date = new Date(doc.date_order);
        const date = raw_date.toLocaleDateString();
        const time = raw_date.toLocaleTimeString();
        doc.date_order = date + ' ' + time;
      }

      const headers = Object.keys(SaleOrderEnum).filter(
        (key) => !headers_to_remove.includes(key as any)
      );

      // Format dates
      this.all_data.transform_generic_data(data, headers, 0, true);
    });
  }
  create() {
    this.navigation_service.go_to(GLOBAL_ROUTES.sale_order);
  }

  export() {
    this.sale_order_service.db.read_all().subscribe((res) => {
      // Get only lines from docs.
      const lines: any[] = [];

      res.rows.map((x) => {
        const doc = x.doc as SaleOrder;

        for (const line of doc.lines) {
          lines.push({
            ...doc,
            ...line,
          });
        }
      });

      this.excel_service.exportAsExcelFile(
        lines,
        this.configuration_service.serial()
      );
    });
  }
}
