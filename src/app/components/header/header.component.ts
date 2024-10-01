import { Component } from '@angular/core';

import { NavigationService } from '../../services/navigation.service';
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
}
