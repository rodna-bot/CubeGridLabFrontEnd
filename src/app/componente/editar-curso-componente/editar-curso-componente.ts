import {Component, inject} from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {UsuariosService} from '../../services/usuarios-service';
import {ActivatedRoute, Router} from '@angular/router';
import {Usuarios} from '../../model/usuarios';
import {CursosService} from '../../services/cursos-service';
import {Cursos} from '../../model/cursos';

@Component({
  selector: 'app-editar-curso-componente',
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
  templateUrl: './editar-curso-componente.html',
  styleUrl: './editar-curso-componente.css',
})
export class EditarCursoComponente {
  cursoForm: FormGroup;
  fb = inject(FormBuilder);
  cursoService = inject(CursosService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  route = inject(ActivatedRoute);
  cursoCodigo: number;

  constructor() {
    this.cursoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Capturar el parámetro 'codigo' del route
    this.route.paramMap.subscribe(params => {
      const codigoParam = params.get('codigo');
      if (codigoParam) {
        this.cursoCodigo = +codigoParam;
        this.cargarCurso(this.cursoCodigo);
      }
    });
  }

  private cargarCurso(codigo: number) {
    this.cursoService.listar().subscribe({
      next: cursos => {
        const curso = cursos.find(c => c.codigo === codigo);
        if (curso) {
          this.cursoForm.patchValue({
            nombre: curso.nombre,
            descripcion: curso.descripcion
          });
        }
      },
      error: err => console.error('Error al cargar usuario:', err)
    });
  }

  onSubmit(): void {
    if (this.cursoForm.invalid) {
      this.snackBar.open('Por favor completa correctamente todos los campos.', 'Cerrar', { duration: 3000 });
      return;
    }

    const curso: Cursos = {
      codigo: this.cursoCodigo,
      nombre: this.cursoForm.value.nombre,
      descripcion: this.cursoForm.value.descripcion,
    };

    this.cursoService.actualizar(curso).subscribe({
      next: () => {
        this.snackBar.open('Curso actualizado exitosamente.', 'Cerrar', { duration: 3000 });
        setTimeout(() => this.router.navigate(['/cursos']), 2000);
        this.cursoForm.reset();
      },
      error: err => {
        console.error(err);
        this.snackBar.open('Error al actualizar curso.', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
