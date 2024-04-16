import { Component, OnInit } from '@angular/core';
import { PopupQrService } from 'src/app/services/popup-qr.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  constructor(public popupService: PopupQrService) { }

  ngOnInit(): void {
  }

  onInfoTouch() {
    this.popupService.setData("Enviando data");
    this.popupService.actualizarMostrar(true)
  }

}
