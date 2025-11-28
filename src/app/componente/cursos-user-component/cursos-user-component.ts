import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-cursos-user-component',
  imports: [CommonModule, MatCardModule],
  templateUrl: './cursos-user-component.html',
  styleUrl: './cursos-user-component.css',
})
export class CursosUserComponent {
  constructor(private router: Router) {}

  irAInscribirse(): void {
    this.router.navigate(['/inscribirse-curso']);
  }

  irACursosInscritos(): void {
    this.router.navigate(['/cursos-inscritos']);
  }
}
