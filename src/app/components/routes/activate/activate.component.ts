import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit {

  activationStatus: string = 'Activating...';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.activateEntity(token);
    } else {
      this.activationStatus = 'Invalid activation link';
    }
  }

  activateEntity(token: string): void {
    const activationUrl = `https://rwttebejxwncpurszzld.supabase.co/functions/v1/activate?token=${token}`;

    this.http.get(activationUrl).subscribe({
      next: () => this.activationStatus = 'Entity activated successfully!',
      error: () => this.activationStatus = 'Activation failed. Please try again.',
    });
  }

}
