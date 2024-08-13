import { Component, OnInit } from '@angular/core';
import { InternoService } from 'src/app/services/interno.service';

@Component({
  selector: 'app-banner-policy',
  templateUrl: './banner-policy.component.html',
  styleUrls: ['./banner-policy.component.css']
})
export class BannerPolicyComponent implements OnInit {

  constructor(private _internalServices: InternoService) { }

   showBanner: boolean = true;

  async ngOnInit() {
    const coockies = await this._internalServices.getCoockes()
    this.showBanner = coockies;
  }

  acceptCookies() {
    this._internalServices.setCoockes(false)
    this.showBanner = false;
  }

  cookiesAccepted(): boolean {
    let coockies = this._internalServices.getCoockes()
   return coockies;
  }

}
