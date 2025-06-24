import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private showToastFlag = false;
  private toastMessage = '¡QR leído!';
  private toastType: 'success' | 'error' = 'success';

  setShowToast(show: boolean, message: string = '¡QR leído!', type: 'success' | 'error' = 'success'): void {
    this.showToastFlag = show;
    this.toastMessage = message;
    this.toastType = type;
  }

  consumeShowToast(): boolean {
    const result = this.showToastFlag;
    this.showToastFlag = false;
    return result;
  }

  getToastMessage(): string {
    return this.toastMessage;
  }

  getToastType(): 'success' | 'error' {
    return this.toastType;
  }
}
