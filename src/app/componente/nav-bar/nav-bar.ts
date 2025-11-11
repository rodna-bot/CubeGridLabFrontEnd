import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-nav-bar',
  imports: [
    RouterLink,
    MatToolbar,
    MatToolbarRow,
    MatButton
  ],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  isAdmin = false;

  constructor() {
    const rolesString = localStorage.getItem('roles');
    if (rolesString) {
      const roles = JSON.parse(rolesString); // convierte ["ROLE_ADMIN"] en un array real
      this.isAdmin = roles.includes('ROLE_ADMIN');
    }
  }
}
