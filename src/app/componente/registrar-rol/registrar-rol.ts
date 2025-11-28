import {Component, inject} from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {RolesService} from '../../services/roles-service';
import {Roles} from '../../model/roles';
import {UsuariosRolesService} from '../../services/usuarios-roles-service';
import {UsuariosService} from '../../services/usuarios-service';
import {Usuarios} from '../../model/usuarios';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {CommonModule} from '@angular/common';


@Component({
  selector: 'app-registrar-rol',
  imports: [
    CommonModule,
    MatCard,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatInputModule,
    MatButton,
    MatSnackBarModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './registrar-rol.html',
  styleUrl: './registrar-rol.css',
})
export class RegistrarRol {
  rolForm: FormGroup;
  asignarForm: FormGroup;
  fb = inject(FormBuilder);
  rolService = inject(RolesService);
  usuariosService =inject(UsuariosService);
  usuarioRolService: UsuariosRolesService = inject(UsuariosRolesService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  usuarios: Usuarios[] = [];
  roles: Roles[] = [];

  constructor() {
    this.rolForm = this.fb.group({
      nombre: ['', Validators.required]
    });

    this.asignarForm = this.fb.group({
      usuarioCodigo: ['', Validators.required],
      rolCodigo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.usuariosService.listar().subscribe({
      next: (data) => this.usuarios = data || [],
      error: (err) => console.error('Error cargando usuarios', err)
    });
    this.rolService.listar().subscribe({
      next: (data) => this.roles = data || [],
      error: (err) => console.error('Error cargando roles', err)
    });
  }

  onSubmitRol(): void {
    if (this.rolForm.invalid) {
      this.snackBar.open('Por favor completa correctamente todos los campos.', 'Cerrar', { duration: 3000 });
      return;
    }

    const rol: Roles = {
      codigo: 0,
      nombre: this.rolForm.value.nombre
    };

    this.rolService.registrar(rol).subscribe({
      next: () => {
        this.snackBar.open('Rol registrado exitosamente.', 'Cerrar', { duration: 3000 });

        setTimeout(() => {
          this.router.navigate(['/gestionar-rol']);
        }, 2000);

        this.rolForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al registrar rol.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  // Asignar rol a usuario
  onSubmitAsignar(): void {
    if (this.asignarForm.invalid) {
      this.snackBar.open('Selecciona usuario y rol.', 'Cerrar', { duration: 3000 });
      return;
    }

    const userId = this.asignarForm.value.usuarioCodigo;
    const rolId = this.asignarForm.value.rolCodigo;

    this.usuarioRolService.registrar(userId, rolId).subscribe({
      next: () => this.snackBar.open('Rol asignado correctamente', 'Cerrar', { duration: 3000 }),
      error: (err) => this.snackBar.open('Error al asignar rol', 'Cerrar', { duration: 3000 }),
    });
  }
}
