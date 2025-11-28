import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ComponentesService} from '../../services/componentes-service';
import {Componentes} from '../../model/componentes';

@Component({
  selector: 'app-agregar-componente-component',
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
  templateUrl: './agregar-componente-component.html',
  styleUrl: './agregar-componente-component.css',
})
export class AgregarComponenteComponent {
  componenteForm: FormGroup;
  fb = inject(FormBuilder);
  componentesService = inject(ComponentesService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.componenteForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      peso: ['', [Validators.required]],
      consumo: ['', [Validators.required]],

    });
  }
  onSubmit(): void {
    if (this.componenteForm.invalid) {
      this.snackBar.open('Por favor completa correctamente todos los campos.', 'Cerrar', { duration: 3000 });
      return;
    }

    const componente:Omit<Componentes, 'codigo'> = {

      nombre: this.componenteForm.value.nombre,
      descripcion: this.componenteForm.value.descripcion,
      tipo: this.componenteForm.value.tipo,
      precio: this.componenteForm.value.precio,
      peso: this.componenteForm.value.peso,
      consumo: this.componenteForm.value.consumo,
    };
    this.componentesService.registrar(componente).subscribe({
    next: result => {
      this.snackBar.open('Componente registrado exitosamente', 'Cerrar', { duration: 3000 });
      setTimeout(() => {
        this.router.navigate(['/componentes']);
      }, 2000);

      this.componenteForm.reset();
    },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al registrar componente.', 'Cerrar', { duration: 3000 });
      }

  })

}}
