import { Injectable } from '@angular/core';
import { ToastrService as NgxToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastrService {
  constructor(private toastr: NgxToastrService) {}

  onSuccess(message: string, title?: string) {
    this.toastr.success(message, title, {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right',
    });
  }

  onError(message: string, title?: string) {
    this.toastr.error(message, title, {
      timeOut: 4000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right',
    });
  }
}
