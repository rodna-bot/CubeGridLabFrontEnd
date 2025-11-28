import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {CursosService} from '../../services/cursos-service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Cursos} from '../../model/cursos';
import {NanosateliteService} from '../../services/Nanosatelite-service';
import {Nanosatelite} from '../../model/nanosatelite';

@Component({
  selector: 'app-registrar-nanosatelite',
  imports: [
    FormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule
  ],
  templateUrl: './registrar-nanosatelite.html',
  styleUrl: './registrar-nanosatelite.css',
})
export class RegistrarNanosatelite {
  NanosateliteForm: FormGroup;
  fb = inject(FormBuilder);
  nanosateliteService = inject(NanosateliteService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.NanosateliteForm = this.fb.group({
      tipo: ['', Validators.required],
      precio: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.NanosateliteForm.invalid) {
      this.snackBar.open('Por favor completa correctamente todos los campos.', 'Cerrar', { duration: 3000 });
      return;
    }

    const nanosatelite: Omit<Nanosatelite, 'codigo'> = {

      tipo: this.NanosateliteForm.value.tipo,
      precio: this.NanosateliteForm.value.precio,
    };

    this.nanosateliteService.registrar(nanosatelite).subscribe({
      next: () => {
        this.snackBar.open('Nanosatelite registrado exitosamente.', 'Cerrar', { duration: 3000 });

        setTimeout(() => {
          this.router.navigate(['/nanosatelite']);
        }, 2000);

        this.NanosateliteForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al registrar nanosatelite.', 'Cerrar', { duration: 3000 });
      }
    });
}}
