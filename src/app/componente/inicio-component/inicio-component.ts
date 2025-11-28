import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-inicio-component',
  imports: [
    RouterLink
  ],
  templateUrl: './inicio-component.html',
  styleUrl: './inicio-component.css',
})
export class InicioComponent {
  isAdmin = false;
  constructor() {
    const rolesString = localStorage.getItem('roles');
    if (rolesString) {
      const roles = JSON.parse(rolesString); // convierte ["ROLE_ADMIN"] en un array real
      this.isAdmin = roles.includes('ROLE_ADMIN');
    }
  }
}
