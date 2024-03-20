import { Component, NgZone, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service.service';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { InternoService } from 'src/app/services/interno.service';
declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  googleUser: any;
  logged:boolean = false;
  usuarios: Usuarios[] = [];
  constructor(private authService:AuthService, private router: Router, private _SupabaseService: SupabaseService, private ngZone: NgZone, private interno:  InternoService) { }

  ngOnInit(): void {
  
  
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
  console.log('Respuesta del servidor:', response);
  this._SupabaseService.getUsers().subscribe((data: any) => {
    this.usuarios = data.email;
    console.log(data);
  });

  
  response.credential;

  var base64Url = response.credential.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64)
    .split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

  this.googleUser = JSON.parse(jsonPayload);
  localStorage.setItem("email", this.googleUser.email);
  localStorage.setItem("photo", this.googleUser.picture)
  localStorage.setItem("name", this.googleUser.name)

  console.log("this.usuarios")
  console.log(this.usuarios)

  this._SupabaseService.getUsers().subscribe((data: any) => {
    this.usuarios = data.email;
    let logg = false;
     if(data == ''){
      this.crearUsuario(this.googleUser.email);
    } 
    console.log(data)
    for (let i = 0; i < data.length; i++) {
      const email = data[i].email;
      if (data[i].email == this.googleUser.email) {
          logg = true;    
          this.interno.setUser(data[i]);
      }

     
      // Realizar la verificación del email aquí
  }
  if(logg){
        
    console.log("Registrado")
    console.log("navegando")
   this.authService.login();
   const dataUs=this.interno.getUser();
   if(dataUs.admin==true){
    this.ngZone.run(() => {
      this.router.navigate(['/qrscan']);
    });
   }else{
    this.ngZone.run(() => {
      this.router.navigate(['/cardSelection']);
    });
   }
   
}else{
  this.interno.setLogged(true);
  console.log("nuevo")
  this.crearUsuario(this.googleUser.email);
}
  
})

  
}

async crearUsuario(email: any): Promise<void> {
  console.log("Creando");
  const dataUser:any = {
    email: email,
    contador_cafe_id: null
  };
  const dataCafe = {
      contador: 0,
        gratis: false,
        opcion: 0,
        cantidad_gratis: 0
  };

   this._SupabaseService.postCafes(dataCafe).subscribe(
    (response) => {
      console.log('cafe creado con éxito', response);
      /* this.router.navigate(['/user']); */
    },
    (error) => {
      console.error('Error al crear cafe', error);
    }
  );

 

setTimeout(() => {
  this._SupabaseService.getCafes().subscribe((data: any) => {
    console.log(data[data.length -1]);
    dataUser.contador_cafe_id = data[data.length -1].id; 
    
})

setTimeout(() => {
  console.log("dataUser");
  console.log(dataUser);
  this._SupabaseService.postUser(dataUser).subscribe(
    (response) => {
      console.log('Usuario creado con éxito', response);     
      this.interno.setLogged(false); 
      this.interno.setUser(dataUser);
      this.authService.login();
      this.ngZone.run(() => {
      this.router.navigate(['/cardSelection']);
    }); 
    },
    (error) => {
      console.error('Error al crear usuario', error);
    }
  );
}, 2000)


}, 2000)
  
}




}


