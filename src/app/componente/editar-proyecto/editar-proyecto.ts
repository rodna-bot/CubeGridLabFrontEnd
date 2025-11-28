import {Component, inject} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder, FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {ProyectosService} from '../../services/proyectos-service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatFormField, MatHint, MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {NgForOf} from '@angular/common';
import {ComponentesService} from '../../services/componentes-service';
import {NanosateliteService} from '../../services/Nanosatelite-service';
import {CursosService} from '../../services/cursos-service';
import {UsuariosService} from '../../services/usuarios-service';
import {CursosFiltradoPorUsuario} from '../../model/cursos-filtrado-por-usuario';
import {Componentes} from '../../model/componentes';
import {Nanosatelite} from '../../model/nanosatelite';
import {MatOption, MatSelect} from '@angular/material/select';
import {Proyectos} from '../../model/proyecto';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'app-editar-proyecto',
  imports: [
    MatButton,
    MatCard,
    MatCardTitle,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatOption,
    MatSelect,
    NgForOf,
    MatHint,
    MatInputModule, //importante para el calendario
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule,
    MatCheckbox,
  ],
  templateUrl: './editar-proyecto.html',
  styleUrl: './editar-proyecto.css',
})
export class EditarProyecto {
  proyectoForm: FormGroup;
  fb = inject(FormBuilder);
  proyectoService = inject(ProyectosService);
  componentesService = inject(ComponentesService);
  nanosateliteService = inject(NanosateliteService);
  cursoService = inject(CursosService);
  usuarioService = inject(UsuariosService);
  cursosAsignados: CursosFiltradoPorUsuario[] = [];
  componentes: Componentes[] = [];
  nanosatelites: Nanosatelite[] = [];
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  route = inject(ActivatedRoute);
  proyectoCodigo: number;
  codigoUsuario = 0;
  constructor() {
  this.proyectoForm = this.fb.group({

    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    fecha_creacion: ['', Validators.required],
    cod_curso: ['', Validators.required],
    cod_nanosatelite: ['', Validators.required],
    componentes: new FormArray([], this.minimoSeleccionado(1))

  })
  }
  ngOnInit(): void {
    const codigoUsuarioStr = localStorage.getItem('codigoUsuario');
    this.codigoUsuario = codigoUsuarioStr ? Number(codigoUsuarioStr) : 0;
    this.route.paramMap.subscribe(params => {
      const codigoParam = params.get('codigo');
      if (codigoParam) {
        this.proyectoCodigo = +codigoParam;
        this.cargarSelects();
        this.cargarProyecto();
      }
    });}
  cargarSelects() {
    this.cursoService.listarCursosPorUsuario(this.codigoUsuario).subscribe(r => {this.cursosAsignados = r});
    this.componentesService.listar().subscribe(r => {this.componentes = r;
      this.componentes.map(componente =>{
      this.componentesArray.push(
        new FormGroup({
          id: new FormControl(componente.codigo),
          nombre: new FormControl(componente.nombre),
          seleccionado: new FormControl(false)
        })
      );
    })});

    this.nanosateliteService.listar().subscribe(r => {this.nanosatelites = r});
  }

  cargarProyecto() {
    this.proyectoService.buscarporId(this.proyectoCodigo).subscribe(proyecto => {

      // precargar datos en el formulario
      this.proyectoForm.patchValue({
        nombre: proyecto.nombre,
        descripcion: proyecto.descripcion,
        fecha_creacion: proyecto.fecha_creacion,
        cod_curso: proyecto.cod_curso.codigo,
        cod_nanosatelite: proyecto.cod_nanosatelite.codigo,
        // componentes: proyecto.componentes[0]?.codigo,

      });
      const seleccionados: Componentes[] = proyecto.componentes; // array de IDs

      this.componentesArray.controls.forEach(ctrl => {
        const codigo = ctrl.get('id')?.value;
        const marcado = seleccionados.some(item => item.codigo === codigo)
        // const marcado = seleccionados.includes(codigo);

        ctrl.get('seleccionado')?.setValue(marcado, { emitEvent: false });
      });
    });
  }

  onSubmit(): void {
    if (this.proyectoForm.invalid) {
      this.snackBar.open('Reellene los campos obligatorios', 'Cerrar', {duration: 3000});
      return;
    }
    const proyecto: Proyectos = {
      codigo: this.proyectoCodigo,
      nombre: this.proyectoForm.value.nombre,
      descripcion: this.proyectoForm.value.descripcion,
      fecha_creacion: this.proyectoForm.value.fecha_creacion,
      cod_usuario:{codigo:this.codigoUsuario} ,
      cod_curso: {codigo:this.proyectoForm.value.cod_curso},
      cod_nanosatelite: {codigo:this.proyectoForm.value.cod_nanosatelite},
      componentes : this.obtenerSeleccionados(),

    };
    this.proyectoService.actualizar(proyecto).subscribe({

      next:()=>{
        this.snackBar.open('Proyecto actualizado exitosamente.', 'Cerrar', {duration: 3000});
        setTimeout(() => {
          this.router.navigate(['/proyectos']);
        }, 2000);
        this.proyectoForm.reset();

      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al actualizar el proyecto.', 'Cerrar', {duration: 3000});
      }})

  }
  get componentesArray(): FormArray {
    return this.proyectoForm.get('componentes') as FormArray;
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
  obtenerSeleccionados() {
    return this.componentesArray.controls
      .filter(ctrl => ctrl.get('seleccionado')?.value === true)
      .map(ctrl => ({
        codigo: ctrl.get('id')?.value,

      }));
  }


}
