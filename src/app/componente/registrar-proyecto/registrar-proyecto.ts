import {Component, inject} from '@angular/core';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatCard, MatCardModule, MatCardTitle} from '@angular/material/card';

import {MatFormField, MatHint, MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {CommonModule, NgForOf} from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {ProyectosService} from '../../services/proyectos-service';
import {ComponentesService} from '../../services/componentes-service';
import {NanosateliteService} from '../../services/Nanosatelite-service';
import {CursosService} from '../../services/cursos-service';
import {UsuariosService} from '../../services/usuarios-service';
import {Router} from '@angular/router';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {CursosFiltradoPorUsuario} from '../../model/cursos-filtrado-por-usuario';
import {Componentes} from '../../model/componentes';
import {Nanosatelite} from '../../model/nanosatelite';
import {Proyectos} from '../../model/proyecto';
import {MatOption, MatSelect, MatSelectModule} from '@angular/material/select';
import {Cursos} from '../../model/cursos';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'app-registrar-proyecto',
  imports: [
    CommonModule, // Reemplaza a NgForOf
    ReactiveFormsModule,
    MatButton,
    MatCard,
    MatCardTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatHint,
    MatInputModule, //importante para el calendario
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule,
    MatCheckbox,
  ],
  templateUrl: './registrar-proyecto.html',
  styleUrl: './registrar-proyecto.css',
})
export class RegistrarProyecto {

  proyectoForm: FormGroup;
  fb = inject(FormBuilder);
  proyectoService = inject(ProyectosService);
  componentesService = inject(ComponentesService);
  nanosateliteService = inject(NanosateliteService);
  cursoService = inject(CursosService);
  usuarioService = inject(UsuariosService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  cursosAsignados: CursosFiltradoPorUsuario[] = [];
  componentes: Componentes[] = [];
  nanosatelites: Nanosatelite[] = [];

  cursos: Cursos[] = [];
  codigoUsuario = 0;


  constructor() {
    this.proyectoForm = this.fb.group({
      // 'cod_usuario' YA NO VA AQUÍ
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required]],
      fecha_creacion: [new Date(), [Validators.required]], // Puedes poner la fecha actual
      cod_curso: [null, [Validators.required]],
      cod_nanosatelite: [null, [Validators.required]],
      componentes: new FormArray([], this.minimoSeleccionado(1))
    });
  }


  // --- ngOnInit se ejecuta al cargar el componente ---
  ngOnInit(): void {

    const codigoUsuarioStr = localStorage.getItem('codigoUsuario');
    this.codigoUsuario  = codigoUsuarioStr ? Number(codigoUsuarioStr) : 0;


    this.cargarCursos();
    // 3. Cargar el resto de combobox
    this.cargarComponentes();
    this.cargarNanosatelites();
  }
  get componentesArray(): FormArray {
    return this.proyectoForm.get('componentes') as FormArray;
  }
  cargarCursos(): void {
    this.cursoService.listarCursosPorUsuario(this.codigoUsuario).subscribe(cursos=>{
      this.cursosAsignados = cursos;
    });

  }

  cargarComponentes(): void {
    this.componentesService.listar().subscribe(componentes => {
      this.componentes = componentes;

      this.componentes.map(componente =>{
        this.componentesArray.push(
          new FormGroup({
            id: new FormControl(componente.codigo),
            nombre: new FormControl(componente.nombre),
            seleccionado: new FormControl(false)
          })
        );
      })

    });
  }

  cargarNanosatelites(): void {
    this.nanosateliteService.listar().subscribe(nanos => {
      this.nanosatelites = nanos;
    });

  }
  private buildComponentesArray(): FormArray {
    // Mapeamos la lista de componentes a una lista de FormControls
    const controls = this.componentes.map(comp =>
      this.fb.control(false) // Cada control inicia en 'false' (no seleccionado)
    );
    return this.fb.array(controls);
  }
  minimoSeleccionado(min: number): ValidatorFn {
    return (control: AbstractControl) => {
      const formArray = control as FormArray;

      const seleccionados = formArray.controls.filter(
        ctrl => ctrl.get('seleccionado')?.value
      ).length;

      return seleccionados >= min ? null : { minSeleccion: true };
    };
  }
  onSubmit(): void {
    if (this.proyectoForm.invalid) {
      this.snackBar.open('Reellene los campos obligatorios', 'Cerrar', {duration: 3000});
      return;
    }

    const proyecto: Partial<Proyectos> = {
      nombre: this.proyectoForm.value.nombre,
      descripcion: this.proyectoForm.value.descripcion,
      fecha_creacion: this.proyectoForm.value.fecha_creacion,
      cod_usuario:{codigo:this.codigoUsuario} ,
      cod_curso: {codigo:this.proyectoForm.value.cod_curso},
      cod_nanosatelite: {codigo:this.proyectoForm.value.cod_nanosatelite},
      componentes : this.obtenerSeleccionados(),
    };
    this.proyectoService.registrar(proyecto).subscribe({

      next:()=>{
      this.snackBar.open('Proyecto registrado exitosamente.', 'Cerrar', {duration: 3000});
      setTimeout(() => {
        this.router.navigate(['/proyectos']);
      }, 2000);
      this.proyectoForm.reset();

    },
    error: (err) => {
      console.error(err);
      this.snackBar.open('Error al registrar proyecto.', 'Cerrar', {duration: 3000});
    }})

  }
  obtenerSeleccionados() {
    return this.componentesArray.controls
      .filter(ctrl => ctrl.get('seleccionado')?.value === true)
      .map(ctrl => ({
        codigo: ctrl.get('id')?.value,

      }));
  }



}
