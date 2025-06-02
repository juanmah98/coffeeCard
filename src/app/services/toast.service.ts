import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _showToast = false;

  setShowToast(show: boolean) {
    this._showToast = show;
  }

  consumeShowToast(): boolean {
    const value = this._showToast;
    this._showToast = false;
    return value;
  }
}
