import { Component, signal } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NavBar} from './componente/nav-bar/nav-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CubeGridLabFrontEnd');
  constructor(private router: Router) {}

  mostrarNavbar(): boolean {
    // Oculta el navbar solo en login y registro
    const rutaActual = this.router.url;
    return !(rutaActual === '/' || rutaActual === '/registrar-usuario');
  }
}
