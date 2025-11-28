import {Component, inject} from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {UsuariosService} from '../../services/usuarios-service';
import {Router} from '@angular/router';
import {Usuarios} from '../../model/usuarios';
import {CursosService} from '../../services/cursos-service';
import {Cursos} from '../../model/cursos';

@Component({
  selector: 'app-agregar-curso-componente',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatInputModule,
    MatButton,
    MatSnackBarModule
  ],
  templateUrl: './agregar-curso-componente.html',
  styleUrl: './agregar-curso-componente.css',
})
export class AgregarCursoComponente {
  cursoForm: FormGroup;
  fb = inject(FormBuilder);
  cursoService = inject(CursosService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.cursoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.cursoForm.invalid) {
      this.snackBar.open('Por favor completa correctamente todos los campos.', 'Cerrar', { duration: 3000 });
      return;
    }

    const curso: Cursos = {
      codigo: 0,
      nombre: this.cursoForm.value.nombre,
      descripcion: this.cursoForm.value.descripcion,
    };

    this.cursoService.registrar(curso).subscribe({
      next: () => {
        this.snackBar.open('Curso registrado exitosamente.', 'Cerrar', { duration: 3000 });

        setTimeout(() => {
          this.router.navigate(['/cursos']);
        }, 2000);

        this.cursoForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al registrar curso.', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
