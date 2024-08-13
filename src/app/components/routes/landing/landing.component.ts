import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private router: Router, private ngZone: NgZone) { }

  ngOnInit(): void {
  }

  accion(){
    this.ngZone.run(() => {   
      this.router.navigate(['/home'])
      }); 
  }
}
