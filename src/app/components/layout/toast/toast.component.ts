import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-toast',
  template: `
    <div #toastElement class="toast" [ngClass]="toastType" [style.display]="isVisible ? 'block' : 'none'">
      <span> {{message}} </span>
      <img 
        *ngIf="toastType === 'success'" 
        src="../../../../assets/imagenes/cards/icons8-cuenta-verificada-48.png" 
        width="30px" alt="✔️">

      <img 
        *ngIf="toastType === 'error'" 
        src='../../../../assets/imagenes/cards/advertencia.png'
        width="24px" alt="❌">
    </div>
  `,
  styles: [`
    .toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 16px;
  border: 1px solid #000;
  border-radius: 8px;
  background-color: white;
  color: black;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;

  /* ✅ Fuerza el ancho a ajustarse solo al contenido */
  width: fit-content;
  max-width: 90vw;

  /* ✅ Elimina estiramientos innecesarios */
  flex-shrink: 1;
  flex-grow: 0;
}

.toast span {
  white-space: nowrap;
}

.toast.success {
  border-color: green;
}

.toast.error {
  border-color: red;
}

 /*    @media (max-width: 600px) {
  .toast {
    left: 50%;
    transform: translateX(-50%);
    right: auto;
  }
} */
  `]
})
export class ToastComponent {
  @ViewChild('toastElement') toastElement!: ElementRef;
  message: string = '';
  toastType: 'success' | 'error' = 'success';
  isVisible: boolean = false;

  showMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.message = message;
    this.toastType = type;
    this.isVisible = true;
    setTimeout(() => {
      this.isVisible = false;
    }, 3000);
  }
}

