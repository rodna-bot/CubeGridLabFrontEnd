import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatFormField, MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

import {ActivatedRoute, Router} from '@angular/router';
import {NanosateliteService} from '../../services/Nanosatelite-service';

import {Nanosatelite} from '../../model/nanosatelite';

@Component({
  selector: 'app-editar-nanosatelite',
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
  templateUrl: './editar-nanosatelite-component.html',
  styleUrl: './editar-nanosatelite-component.css',
})
export class EditarNanosatelite {
  NanoForm: FormGroup;
  fb = inject(FormBuilder);
  nanosateliteService = inject(NanosateliteService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  route = inject(ActivatedRoute);
  nanosateliteCodigo: number;

  constructor() {
    this.NanoForm = this.fb.group({
      tipo: ['', [Validators.required]],
      precio: ['', Validators.required]
    });}
  ngOnInit(): void {
    // Capturar el parámetro 'codigo' del route
    this.route.paramMap.subscribe(params => {
      const codigoParam = params.get('codigo');
      if (codigoParam) {
        this.nanosateliteCodigo = +codigoParam;
        this.cargarNanosatelite(this.nanosateliteCodigo);
      }
    });
  }
  private cargarNanosatelite(codigo: number) {
    this.nanosateliteService.listar().subscribe({
      next: nanosatelites => {
        const nano = nanosatelites.find(n => n.codigo === codigo);
        if (nano) {
          this.NanoForm.patchValue({
            tipo: nano.tipo,
            precio: nano.precio
          });
        }
      },
      error: err => console.error('Error al cargar nanosatelite:', err)
    });
  }
  onSubmit(): void {
    if (this.NanoForm.invalid) {
      this.snackBar.open('Por favor completa correctamente todos los campos.', 'Cerrar', {duration: 3000});
      return;
    }
    const nano: Nanosatelite = {
      codigo: this.nanosateliteCodigo,
      tipo: this.NanoForm.value.tipo,
      precio: this.NanoForm.value.precio,

    };

    this.nanosateliteService.actualizar(nano).subscribe({
      next: () => {
        this.snackBar.open('Nanosatelite actualizado exitosamente.', 'Cerrar', { duration: 3000 });
        setTimeout(() => this.router.navigate(['/nanosatelite']), 2000);
        this.NanoForm.reset();
      },
      error: err => {
        console.error(err);
        this.snackBar.open('Error al actualizar nanosatelite.', 'Cerrar', { duration: 3000 });
      }
    });
  }



}
