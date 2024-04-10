import { Component, NgZone, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service.service';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { InternoService } from 'src/app/services/interno.service';
import { CafeData } from 'src/app/interfaces/cafes_data';
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
      this.crearUsuario(this.googleUser.email, this.googleUser.name);
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
  this.crearUsuario(this.googleUser.email, this.googleUser.name);
}
  
})

  
}


async crearCafeRealtime(){

}

async createCafe(dataCafe:any) {
  try {
    const response = await this._SupabaseService.postCafes(dataCafe).toPromise();
    console.log('Café creado con éxito', response);
    // Continúa aquí con lo que necesites hacer con la respuesta
    return response; // Retorna la respuesta si es necesario
  } catch (error) {
    console.error('Error al crear café', error);
    throw error; // Propaga el error si es necesario
  }
}

// Llamada a la función asincrónica



async crearUsuario(email: any, name:any): Promise<void> {
  console.log("Creando");
  const dataUser:any = {
    email: email,
    contador_cafe_id: null,
    name: name,
    entidad_id: "e4180b6c-a43e-4157-86c1-3c134ede2bb8",
    admin: false
  };
  const dataCafe:any = {
       
      contador: 0,
        gratis: false,
        opcion: 0,
        cantidad_gratis: 0
  };
  
  console.log("dataCafe")
  console.log(dataCafe)

   
  const response:any = (await this._SupabaseService.postNewCoffe(dataCafe)).data;
console.log("Contador_cafe CREADO", response);
if (response && response.length > 0) {
    dataUser.contador_cafe_id = response[0].id;
    console.log("contador_cafe_id", dataUser.contador_cafe_id);
} else {
    console.error("Error al obtener la respuesta del contador_cafe");
    // Manejar el error adecuadamente
}

const responseUser:any = (await this._SupabaseService.postNewUser(dataUser)).data;
console.log("Usuario CREADO", responseUser);

      
      this.interno.setLogged(false); 
      this.interno.setUser(responseUser[0]);
      console.log("DATA PARA SET INTERNO",responseUser[0])
       this.authService.login();
      this.ngZone.run(() => {
      this.router.navigate(['/cardSelection']);
    }); 

   

  /*  this._SupabaseService.postUser(dataUser).subscribe(
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
  ); */
  
 /*  this.createCafe(dataCafe)
  .then((response) => {
    console.log('cafe creado con éxito', response);
  })
  .catch((error) => {
    console.error('Error al crear cafe', error);
  }); */

 

/* setTimeout(() => {
  this._SupabaseService.getCafes().subscribe((data: any) => {
    console.log("CafeID");
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


}, 2000) */
  
}






}


