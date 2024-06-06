import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service.service';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { InternoService } from 'src/app/services/interno.service';
import { CafeData } from 'src/app/interfaces/cafes_data';
import { Entidades } from 'src/app/interfaces/entdidades';
import { Usuarios_admins } from 'src/app/interfaces/usuarios_admin';
declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  loading:boolean = false;
  googleUser: any;
  logged:boolean = false;
  usuarios: Usuarios[] = [];
  admins: Usuarios_admins[] =[]
  entidades:Entidades[]=[];
  userAdmin:boolean = false;
  entidad:string='';
  constructor(private cdr: ChangeDetectorRef, private authService:AuthService, private router: Router, private _SupabaseService: SupabaseService, private ngZone: NgZone, private interno:  InternoService) { }

  async ngOnInit(): Promise<void> {
    this.getEntidades()

   await this.getAdmins();
   /* await this.getUsers(); */
    this.userAdmin = false;
  
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

async getAdmins() {
  try {
    const response:any = await this._SupabaseService.getUsersAdminTable();
    console.log('ADMINS', response.data);
    this.admins = response.data;
    // Continúa aquí con lo que necesites hacer con la respuesta
    return response; // Retorna la respuesta si es necesario
  } catch (error) {
    console.error('Error al cargar admins', error);
    throw error; // Propaga el error si es necesario
  }
}

async getUsers() {
  try {
    const response:any = await this._SupabaseService.getUsersTable();
    console.log('USUARIOS', response.data);
    this.usuarios = response.data;
    // Continúa aquí con lo que necesites hacer con la respuesta
    return response; // Retorna la respuesta si es necesario
  } catch (error) {
    console.error('Error al cargar usuarios', error);
    throw error; // Propaga el error si es necesario
  }
}

async getEntidades() {
  try {
    const response:any = await this._SupabaseService.getEntidades();
    console.log('ENTIDADES', response.data);
    this.entidades = response.data;
    // Continúa aquí con lo que necesites hacer con la respuesta
    return response; // Retorna la respuesta si es necesario
  } catch (error) {
    console.error('Error al cargar entidades', error);
    throw error; // Propaga el error si es necesario
  }
}


handleCredentialResponse = async (response: any) => {
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
  this.loading = true;

  
  this.admins.forEach(data=>{
    if(this.googleUser.email == data.email)
      {
       this.entidad = data.entidad_id;
        this.userAdmin=true;
      }
  })

  await this.setEntidad()

  if(this.userAdmin){

    this.authService.login();
     this.ngZone.run(() => {
      this.loading = false;
      this.router.navigate(['/qrscan']);
    }); 
  }else{
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
       this.ngZone.run(() => {
        this.loading = false;
        this.router.navigate(['/principal']);
      }); 
      
     
  }else{
    this.interno.setLogged(true);
    console.log("nuevo")
    this.crearUsuario(this.googleUser.email, this.googleUser.name);
  }
    
  })
  }

  

  
}

async setEntidad(){

  this.entidades.forEach(data=>{
    if(data.id == this.entidad){
    this.interno.setEntidad(data); 
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
    name: name,
    fecha_creacion: new Date(),
  };
/*   const dataCafe:any = {
       
      contador: 0,
        gratis: false,
        opcion: 0,
        cantidad_gratis: 0
  }; */
  
/*   console.log("dataCafe")
  console.log(dataCafe) */

   
/*   const response:any = (await this._SupabaseService.postNewCoffe(dataCafe)).data;
console.log("Contador_cafe CREADO", response);
if (response && response.length > 0) {
    dataUser.contador_cafe_id = response[0].id;
    console.log("contador_cafe_id", dataUser.contador_cafe_id);
} else {
    console.error("Error al obtener la respuesta del contador_cafe");
    // Manejar el error adecuadamente
} */

const responseUser:any = (await this._SupabaseService.postNewUser(dataUser)).data;
console.log("Usuario CREADO", responseUser);

      
      this.interno.setLogged(false); 
      this.interno.setUser(responseUser[0]);
      console.log("DATA PARA SET INTERNO",responseUser[0])
       this.authService.login();
       this.ngZone.run(() => {
      this.loading = false;
      this.router.navigate(['/principal']);
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

menu(){
  this.router.navigate(['/menu'])
}




}


