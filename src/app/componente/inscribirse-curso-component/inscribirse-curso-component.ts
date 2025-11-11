import {Component, inject, ViewChild} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef, MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow,
  MatRowDef,
  MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {Cursos} from '../../model/cursos';
import {CursosService} from '../../services/cursos-service';
import {MatDialog} from '@angular/material/dialog';
import {UsuariosCursos} from '../../model/usuarios-cursos';
import {CommonModule} from '@angular/common';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'app-inscribirse-curso-component',
  imports: [
    CommonModule,
    MatTable,
    MatColumnDef,
    MatHeaderRowDef,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatPaginator,
    MatButton,
    MatSnackBarModule
  ],
  templateUrl: './inscribirse-curso-component.html',
  styleUrl: './inscribirse-curso-component.css',
})
export class InscribirseCursoComponent {
  displayedColumns: string[] = ['codigo', 'nombre', 'descripcion', 'accion1'];
  dataSource: MatTableDataSource<Cursos> = new MatTableDataSource<Cursos>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private cursoService = inject(CursosService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar); // ✅ ESTA LÍNEA AGREGA EL SERVICIO CORRECTAMENTE

  ngOnInit() {
    this.cursoService.listar().subscribe({
      next: (data) => (this.dataSource.data = data),
      error: (err) => console.error('Error al listar cursos', err),
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  inscribirseCurso(cursoId: number) {
    const userId = localStorage.getItem('codigoUsuario');

    if (!userId) {
      this.snackBar.open('No se pudo obtener el ID del usuario. Inicia sesión nuevamente.', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    const usuarioCurso: UsuariosCursos = {
      usuarioId: { codigo: +userId, username: '', password: '' },
      cursoId: { codigo: cursoId, nombre: '', descripcion: '' },
    };

    if (confirm('¿Deseas inscribirte en este curso?')) {
      this.cursoService.registrarUsuarioCurso(usuarioCurso).subscribe({
        next: () => {
          this.snackBar.open('Inscripción realizada correctamente.', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/inscribirse-curso']);
        },
        error: (err) => {
          console.error('Error al inscribirse en el curso', err);
          this.snackBar.open('Error al inscribirse en el curso.', 'Cerrar', { duration: 3000 });
        },
      });
    }
  }
}
