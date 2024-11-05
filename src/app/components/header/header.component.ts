import { Component } from '@angular/core';

import {
  GLOBAL_ROUTES,
  NavigationService,
} from '../../services/navigation.service';
import { RouterLink } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgbCollapseModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(public navigation_service: NavigationService) {}
  isMenuCollapsed = true;
  navigate() {
    this.navigation_service.go_to(GLOBAL_ROUTES.sale_order_list);
  }

  menus = [
    {
      title: 'Ordenes',
      route: GLOBAL_ROUTES.sale_order_list,
      icon: 'fa-file-invoice-dollar',
    },
    {
      title: 'Contactos',
      route: GLOBAL_ROUTES.partner_load,
      icon: 'fa-users',
    },
    {
      title: 'Productos',
      route: GLOBAL_ROUTES.product_load,
      icon: 'fa-box',
    },
    {
      title: 'Configurations',
      icon: 'fa-cogs',
      route: GLOBAL_ROUTES.configuration,
    },
  ];
}
