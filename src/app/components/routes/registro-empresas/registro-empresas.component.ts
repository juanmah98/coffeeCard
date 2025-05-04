import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Entidades } from 'src/app/interfaces/entdidades';
import { transform } from 'html2canvas/dist/types/css/property-descriptors/transform';
declare var google: any;

@Component({
  selector: 'app-registro-empresas',
  templateUrl: './registro-empresas.component.html',
  styleUrls: ['./registro-empresas.component.css']
})
export class RegistroEmpresasComponent implements OnInit {

  companyForm: FormGroup;
  status:string = '0';
  currentStep = 1;
  googleUser: any;
  constructor(private router: Router, private fb: FormBuilder, private _supaServices: SupabaseService, private ngZone: NgZone,) {
    // Inicializa el formulario
    this.companyForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pais: ['', Validators.required],
      direccion: ['', Validators.required],
      /* descripcion: ['', Validators.required], */
      categoria: ['', Validators.required],
      logo: [''], // Se usará para almacenar el archivo de logo
      informacion:['', Validators.required],
      /* titulo:['', Validators.required], */

    });
  }

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

  onSubmit() {
    console.log("estamos aqui")
    if (this.companyForm.valid) {
      this.registerCompany();
    }
  }

  async registerCompany() {
    // Muestra los datos en consola
    const entidad: any = {
      nombre: this.companyForm.value.nombre.toLowerCase(),
      email: this.companyForm.value.email.toLowerCase(),
      background: '1',
      tabla_contador: '',
      fecha_creacion: new Date(),
      pais: this.companyForm.value.pais.toLowerCase(),
      informacion: this.companyForm.value.informacion,
      direccion: this.companyForm.value.direccion.toLowerCase(),
      rubro: this.companyForm.value.categoria.toLowerCase(), 
      logo: ''
    }; 
   console.log(entidad)
   await this.uploadLogo( this.companyForm.value.logo,  this.companyForm.value.nombre)
   console.log("antes de logo")
   const logoUrl: any = await this._supaServices.getPublicImageUrl(this.companyForm.value.nombre)
  entidad.logo = logoUrl;
      const responseUser:any = (await this._supaServices.postNewEntity(entidad)).data;
      this.redirect()
     // Muestra los datos en consola
    /*  this.router.navigate(['/welcome']); */ 

    
  }

  async uploadLogo(file: File, nombre: string) {
    console.log("en logos")
    
      try {
        const response = await this._supaServices.uploadImage(file, "logos_fidelity", nombre);  // Aquí subimos el archivo real
        console.log('Logo subido con exito', response);
      } catch (error) {
        console.error('Error al subir el logo:', error);
      }
  }

  redirect(): void {
    this.companyForm.reset();
    this.ngZone.run(() => {   
      this.router.navigate(['/home']);
      }); 
  }

  onLogoSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.companyForm.patchValue({ logo: fileInput.files[0] });
    }
  }

  statusChange(dato:string){
    this.status = dato;
    this.currentStep = Number(dato);
  }



  handleCredentialResponse = async (response: any) => {

   
     
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
   
   
     
   }
}
