import { Injectable } from '@angular/core';
import { defer } from 'rxjs';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}

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
}
