import {Component, inject} from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ComponentesService} from '../../services/componentes-service';
import {ActivatedRoute, Router} from '@angular/router';
import {Componentes} from '../../model/componentes';

@Component({
  selector: 'app-editar-componente-component',
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
  templateUrl: './editar-componente-component.html',
  styleUrl: './editar-componente-component.css',
})
export class EditarComponenteComponent {
  componenteForm: FormGroup;
  fb = inject(FormBuilder);
  componenteService = inject(ComponentesService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  route = inject(ActivatedRoute);
  componenteCodigo: number;

  constructor() {
    this.componenteForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      tipo: ['', Validators.required],
      precio: ['', Validators.required],
      peso: ['', Validators.required],
      consumo: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const codigoparam = params.get('codigo');
      if (codigoparam) {
        this.componenteCodigo = +codigoparam;
        this.cargarComponente(this.componenteCodigo);
      }
    });

  }

  private cargarComponente(codigo: number) {
    this.componenteService.listar().subscribe({
      next: componentes => {
        const comp = componentes.find(c => c.codigo === codigo);
        if (comp) {
          this.componenteForm.patchValue({
            nombre: comp.nombre,
            descripcion: comp.descripcion,
            tipo: comp.tipo,
            precio: comp.precio,
            peso: comp.peso,
            consumo: comp.consumo
          });
        }
      },
      error: error => console.error('Error al cargar componentes', error),

    })
  }

  onSubmit(): void {
    if (this.componenteForm.invalid) {
      this.snackBar.open('Porfavor completa correctamente todos los campos', 'Cerrar', {duration: 3000});
      return;
    }
    const componente: Componentes = {
      codigo: this.componenteCodigo,

      nombre: this.componenteForm.value.nombre,

      descripcion: this.componenteForm.value.descripcion,

      tipo: this.componenteForm.value.tipo,

      precio: this.componenteForm.value.precio,

      peso: this.componenteForm.value.peso,

      consumo: this.componenteForm.value.consumo
    }
    this.componenteService.actualizar(componente).subscribe({
      next: () => {
        this.snackBar.open('Componente actualizado exitosamente.', 'Cerrar', {duration: 3000});
        setTimeout(() => this.router.navigate(['/componentes']), 2000);
        this.componenteForm.reset();
      },
      error: err => {
        console.error(err);
        this.snackBar.open('Error al actualizar componente.', 'Cerrar', {duration: 3000});
      }
    });
  }





}
