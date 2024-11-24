import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit, OnDestroy {
  activationStatus: string = 'Activating...';
  activo = false;
  private subscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private _SupabaseService: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.activateEntity(token);
      this.handleRealTimeUpdate(token);
    } else {
      this.activationStatus = 'Invalid activation link';
    }
  }

  async activateEntity(token: string): Promise<void> {
    const success = await this._SupabaseService.activateEntityViaEdgeFunction(token);
    if (success) {
      this.activationStatus = '¡Felicidades, ya estás activo!';
      this.activo = true;
    } else {
      this.activationStatus = 'Activation failed. Please try again.';
    }
  }

  handleRealTimeUpdate(token: string): void {
    this.subscription = this._SupabaseService.getEntidadRealtime(token).subscribe(update => {
      const data: any = update;
      if (data.new.activation_token === token && data.new.is_active) {
        this.ngZone.run(() => {
          this.activationStatus = '¡Felicitaciones, ya estás activo!';
          this.activo = true;
          this.cdr.detectChanges();
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  redirect(): void {
    this.ngZone.run(() => {
      this.router.navigate(['/home']);
    });
  }
}
