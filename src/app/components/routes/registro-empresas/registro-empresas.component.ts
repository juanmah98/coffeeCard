import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Entidades } from 'src/app/interfaces/entdidades';

@Component({
  selector: 'app-registro-empresas',
  templateUrl: './registro-empresas.component.html',
  styleUrls: ['./registro-empresas.component.css']
})
export class RegistroEmpresasComponent implements OnInit {

  companyForm: FormGroup;
  status:string = '1';
  constructor(private router: Router, private fb: FormBuilder, private _supaServices: SupabaseService, private ngZone: NgZone,) {
    // Inicializa el formulario
    this.companyForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pais: ['', Validators.required],
      direccion: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      logo: [''], // Se usará para almacenar el archivo de logo
      informacion:['', Validators.required],
      titulo:['', Validators.required],

    });
  }

  ngOnInit(): void {}

  onSubmit() {
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
      text_card: this.companyForm.value.titulo.toLowerCase(),
    }; 
   console.log(entidad)
     /*  const responseUser:any = (await this._supaServices.postNewEntity(entidad)).data; */
      this.redirect()
     // Muestra los datos en consola
    /*  this.router.navigate(['/welcome']); */ 

    
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
  }
}
