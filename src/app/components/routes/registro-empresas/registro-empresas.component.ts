import { Component, OnInit } from '@angular/core';
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

  constructor(private router: Router, private fb: FormBuilder, private _supaServices: SupabaseService) {
    // Inicializa el formulario
    this.companyForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pais: ['', Validators.required],
      direccion: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      logo: [''] // Se usará para almacenar el archivo de logo
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.companyForm.valid) {
      this.registerCompany();
    }
  }

  async registerCompany() {
    console.log(this.companyForm.value); // Muestra los datos en consola
    const entidad: any = {
      nombre: this.companyForm.value.nombre.toLowerCase(),
      email: this.companyForm.value.email.toLowerCase(),
      background: '1',
      tabla_contador: '',
      fecha_creacion: new Date(),
      pais: this.companyForm.value.pais,
      informacion: this.companyForm.value.descripcion.toLowerCase(),
      direccion: this.companyForm.value.direccion.toLowerCase(),
      text_card: this.companyForm.value.nombre.toLowerCase()
    }; 
    console.log("entidad: "+ entidad);
     const responseUser:any = (await this._supaServices.postNewEntity(entidad)).data; 
    console.log("supabase: " +responseUser );  // Muestra los datos en consola
    /*  this.router.navigate(['/welcome']); */ 
  }

  onLogoSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.companyForm.patchValue({ logo: fileInput.files[0] });
    }
  }
}
