import { Component, OnInit } from '@angular/core';
import { PopupInfoService } from 'src/app/services/popup-info.service';
import { PopupVService } from 'src/app/services/popup-v.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public popupService: PopupVService) { }

  ngOnInit(): void {
  }

  onInfoTouch() {
    this.popupService.actualizarMostrar(true)
  }

}
