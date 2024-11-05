import {
  AfterViewInit,
  Component,
  ElementRef,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ToastsContainer } from './services/toast.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToastsContainer],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  constructor(public noti_service: NotificationService) {}

  @ViewChild('toast') toastTemplate!: TemplateRef<any>; // Changed variable name for clarity

  ngAfterViewInit(): void {
    this.noti_service.toast_template = this.toastTemplate;
  }
}
