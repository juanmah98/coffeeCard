import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-toast',
  template: `
    <div #toastElement class="toast" [style.display]="isVisible ? 'block' : 'none'">
      {{ message }}
    </div>
  `,
  styles: [`
    .toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 10px 20px;
      border: 1px solid #000;
      border-radius: 5px;
      background-color: white;
      color: black;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      z-index: 1000;
    }
  `]
})
export class ToastComponent {
  @ViewChild('toastElement') toastElement!: ElementRef;
  message: string = '';
  isVisible: boolean = false;

  showMessage(message: string): void {
    this.message = message;
    this.isVisible = true;
    setTimeout(() => {
      this.isVisible = false;
    }, 3000); // Ocultar el toast después de 3 segundos
  }
}
