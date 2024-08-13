// spline-viewer.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-spline-viewer',
  templateUrl: './spline-viewer.component.html',
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    spline-viewer {
      width: 100%;
      height: 100vh;
      display: block;
    }
    body{
    background-color: RGB(228, 228, 246);
}
  .fondo{
    padding-top:0.5rem;
    padding-bottom:0.5rem;
  }
  `]
})
export class SplineViewerComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  home(){
    this.router.navigate(['/cardSelection']);
  }
}
