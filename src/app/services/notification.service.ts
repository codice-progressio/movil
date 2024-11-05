import { Injectable, signal, TemplateRef } from '@angular/core';
import { defer } from 'rxjs';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toast_service: ToastService) {}

  confirmation(
    title: string,
    confirmButtonText: string = 'Guardar',
    denyButtonText: string = 'Cancelar',
    cancelButtonText: string = 'Descartar'
  ) {
    return defer(() =>
      Swal.fire({
        title,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText,
        denyButtonText,
        cancelButtonText,
      })
    );
  }

  success(title: string, text: string) {
    Swal.fire({
      icon: 'success',
      title,
      text,
    });
  }

  info(title: string, text: string) {
    Swal.fire({
      icon: 'info',
      title,
      text,
    });
  }

  error(title: string, text: string) {
    Swal.fire({
      icon: 'error',
      title,
      text,
    });
  }

  private _toast_template!: TemplateRef<any>;

  set toast_template(template: TemplateRef<any>) {
    this._toast_template = template;
  }

  get toast_template(): TemplateRef<any> {
    return this._toast_template;
  }

  toast_message = signal<string>('');

  toast(msg: string) {
    this.toast_message.set(msg);
    this.toast_service.show({
      template: this.toast_template,
      classname: '',
      delay: 3000,
    });
  }
}
