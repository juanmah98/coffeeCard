import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit, OnDestroy {
  activationStatus: string = 'Activating...';
  activo = false;
  private subscription: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private _SupabaseService: SupabaseService,
    private cdr: ChangeDetectorRef  // Inyecta tu servicio de Supabase
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.activateEntity(token);
      this.handleRealTimeUpdate(token);  // Escuchar actualizaciones en tiempo real
    } else {
      this.activationStatus = 'Invalid activation link';
    }
  }

  async activateEntity(token: string): Promise<void> {
    const { data, error } = await this._SupabaseService.activateEntity(token);
    if (error) {
      this.activationStatus = 'Activation failed. Please try again.';
    } else {
      this.activationStatus = 'Felicidades, ya estas activo!';
      this.activo = true;
      
    }
  }

  // Método para escuchar cambios en tiempo real usando el servicio
  handleRealTimeUpdate(token: string): void {
    this.subscription = this._SupabaseService.getEntidadRealtime(token).subscribe(update => {
      const data: any = update;
      // Aquí verificamos si el token coincida y si la entidad está activa
      if (data.new.token === token && data.new.activo === true) {
        this.ngZone.run(() => {
          this.activationStatus = 'Felicitaciones, ya estas activo!';
          this.activo = true;  // Cambiar estado para mostrar la activación
          this.cdr.detectChanges();
          
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();  // Aseguramos de desuscribirnos cuando el componente se destruye
    }
  }

  redirect(): void {
    this.ngZone.run(() => {
      this.router.navigate(['/home']);
    });
  }
}
