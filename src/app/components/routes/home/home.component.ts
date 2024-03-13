import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service.service';
import { Router } from '@angular/router';
declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  googleUser: any;
  usuarios: any[] = [];
  constructor(private authService:AuthService, private router: Router) { }

  ngOnInit(): void {
   /* GET API */

  
  setTimeout(() => {
    google.accounts.id.initialize({
      client_id: '1098514169833-k37o1p50kphlrpf10jeftk7d5qumb6sv.apps.googleusercontent.com',
      callback: this.handleCredentialResponse
    });

    google.accounts.id.prompt();

    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }
    );
  }, 1000)
}

handleCredentialResponse = (response: any) => {
  response.credential;

  var base64Url = response.credential.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64)
    .split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

  this.googleUser = JSON.parse(jsonPayload);
  localStorage.setItem("email", this.googleUser.email);
  localStorage.setItem("profilePhoto", this.googleUser.picture)
  localStorage.setItem("name", this.googleUser.name)
  this.authService.login();
  this.router.navigate(['/cardSelection']);
}


}
