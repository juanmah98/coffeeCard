import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner-policy',
  templateUrl: './banner-policy.component.html',
  styleUrls: ['./banner-policy.component.css']
})
export class BannerPolicyComponent implements OnInit {

  constructor() { }

   showBanner: boolean = true;

  ngOnInit() {
    this.showBanner = !this.cookiesAccepted();
  }

  acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    this.showBanner = false;
  }

  cookiesAccepted(): boolean {
    return localStorage.getItem('cookiesAccepted') === 'true';
  }

}
