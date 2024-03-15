import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-selection',
  templateUrl: './card-selection.component.html',
  styleUrls: ['./card-selection.component.css']
})
export class CardSelectionComponent implements OnInit {
  imagen = '';
  constructor() { }

  ngOnInit(): void {

    const profilePhotoUrl = localStorage.getItem("profilePhoto");

  }

}
