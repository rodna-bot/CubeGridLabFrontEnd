import { Component } from '@angular/core';
import {MatCard, MatCardContent, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {UsuariosService} from '../../services/usuarios-service';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-iniciar-sesion-component',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatInputModule,
    MatButton,
    MatSnackBarModule,
    RouterLink,
  ],
  templateUrl: './iniciar-sesion-component.html',
  styleUrl: './iniciar-sesion-component.css',
})
export class IniciarSesionComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;

      this.usuariosService.autenticarToken(this.loginForm.value).subscribe({
        next: (data) => {
          // Guardar token y roles
          localStorage.setItem('token', data.jwt);
          localStorage.setItem('roles', JSON.stringify(data.roles));
          console.log("este es su tocken: " + data.jwt);

          // Obtener codigo del usuario
          this.usuariosService.obtenerCodigo(username).subscribe({
            next: (codigo) => {
              localStorage.setItem('codigoUsuario', codigo.toString()); // guardar el código en localStorage
              console.log('Código del usuario:', codigo);

              alert('Inicio de sesión exitoso');
              this.router.navigate(['/inicio']);
            },
            error: (err) => {
              console.error('Error al obtener el código del usuario:', err);
              alert('No se pudo obtener el código del usuario');
            }
          });
        },
        error: (err) => {
          console.error(err);
          alert('Credenciales incorrectas');
        }
      });
    }
  }
}
