import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {RolesService} from '../../services/roles-service';
import {UsuariosService} from '../../services/usuarios-service';
import {UsuariosRolesService} from '../../services/usuarios-roles-service';
import {Router} from '@angular/router';
import {Usuarios} from '../../model/usuarios';
import {Roles} from '../../model/roles';
import {CursosService} from '../../services/cursos-service';
import {Cursos} from '../../model/cursos';
import {UsuariosCursos} from '../../model/usuarios-cursos';

@Component({
  selector: 'app-asignar-usuario-curso-component',
  imports: [
    CommonModule,
    MatCard,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInputModule,
    MatButton,
    MatSnackBarModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './asignar-usuario-curso-component.html',
  styleUrl: './asignar-usuario-curso-component.css',
})
export class AsignarUsuarioCursoComponent {
  asignarForm: FormGroup;
  fb = inject(FormBuilder);
  usuariosService = inject(UsuariosService);
  cursosService = inject(CursosService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  usuarios: Usuarios[] = [];
  cursos: Cursos[] = [];

  constructor() {
    this.asignarForm = this.fb.group({
      usuarioCodigo: ['', Validators.required],
      cursoCodigo: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Cargar usuarios
    this.usuariosService.listar().subscribe({
      next: (data) => (this.usuarios = data || []),
      error: (err) => console.error('Error cargando usuarios', err),
    });

    // Cargar cursos
    this.cursosService.listar().subscribe({
      next: (data) => (this.cursos = data || []),
      error: (err) => console.error('Error cargando cursos', err),
    });
  }

  onSubmitAsignar(): void {
    if (this.asignarForm.invalid) {
      this.snackBar.open('Selecciona usuario y curso.', 'Cerrar', { duration: 3000 });
      return;
    }

    const userId = this.asignarForm.value.usuarioCodigo;
    const cursoId = this.asignarForm.value.cursoCodigo;

    // Crear objeto que coincida con el DTO del backend
    const usuarioCurso: UsuariosCursos = {
      usuarioId: { codigo: userId },
      cursoId: { codigo: cursoId }
    };
    console.log(usuarioCurso)
    // Llamar al servicio con el objeto completo
    this.cursosService.registrarUsuarioCurso(usuarioCurso).subscribe({
      next: () => {
        this.snackBar.open('Curso asignado correctamente.', 'Cerrar', { duration: 3000 });
        this.asignarForm.reset();
      },
      error: (err) => {
        console.error('Error al asignar curso:', err);
        this.snackBar.open('Error al asignar curso.', 'Cerrar', { duration: 3000 });
      },
    });
  }
}
