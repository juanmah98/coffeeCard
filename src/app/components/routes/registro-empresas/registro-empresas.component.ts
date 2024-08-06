import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-empresas',
  templateUrl: './registro-empresas.component.html',
  styleUrls: ['./registro-empresas.component.css']
})
export class RegistroEmpresasComponent implements OnInit {

  company = {
    name: '',
    contactEmail: '',
    phone: '',
    address: '',
    description: '',
    category: '',
    logo: null
  };

  constructor(private router: Router) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }




  onSubmit() {
    // Enviar los datos del formulario al backend
    this.registerCompany();
  }

  registerCompany() {
    // Lógica para enviar los datos de la empresa al backend
    console.log(this.company);
    // Ejemplo de redirección después del registro
    this.router.navigate(['/welcome']);
  }
}
