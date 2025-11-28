import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-proyecto-home',
  imports: [
    CommonModule,
    RouterLink,

  ],
  templateUrl: './proyecto-home.html',
  styleUrl: './proyecto-home.css',
})
export class ProyectoHome {
  isAdmin = false;
  cards = [
    {
      title: 'Gestión de Componentes',
      description: 'Desde aqui puede modificar los componentes registrados o añadir mas',
      buttonText: 'Ver componentes',
      image: 'https://images.pexels.com/photos/60132/pexels-photo-60132.jpeg?auto=compress&cs=tinysrgb&w=600',
      link: '/componentes'
    },
    {
      title: 'Gestión de nanosatélites',
      description: 'Aprende para qué sirven los partes de un nanosatélite y sus aplicaciones tecnológicas',
      buttonText: 'Ver nanosatélites',
      image: 'https://www.lavanguardia.com/files/image_990_484/uploads/2018/11/29/5fa4460a51ac6.jpeg',
      link: '/nanosatelite'
    },

  ];
  cards2 = [
    {
      title: 'Gestión de proyectos',
      description: 'Aprende a planificar, coordinar y ejecutar proyectos aeroespaciales con éxito',
      buttonText: 'Ver proyectos',
      image: 'https://images.pexels.com/photos/60132/pexels-photo-60132.jpeg?auto=compress&cs=tinysrgb&w=600',
      link: '/proyectos'
    },
    {
      title: 'Gestión de simulaciones',
      description: 'Aprende para qué sirven los partes de un nanosatélite y sus aplicaciones tecnológicas',
      buttonText: 'Ver simulaciones',
      image: 'https://images.pexels.com/photos/5207240/pexels-photo-5207240.jpeg' ,
      link: '/simulaciones'
    },

    ];
  constructor(){}
  ngOnInit() {
    const rolesString = localStorage.getItem('roles');
    if (rolesString) {
      try {
        const roles = JSON.parse(rolesString); // convierte ["ROLE_ADMIN"] en un array real
        this.isAdmin = roles.includes('ROLE_ADMIN');
      }
      catch (e) {
        console.error("Error al parsear roles desde localStorage", e);
        this.isAdmin = false; // Mantener como false si hay un error
    }}
  }
}


