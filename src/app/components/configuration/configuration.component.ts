import { Component, effect, signal } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { FormsModule } from '@angular/forms';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css',
})
export class ConfigurationComponent {
  constructor(public configuration_service: ConfigurationService) {
    
  }
}
