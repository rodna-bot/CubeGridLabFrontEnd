import {Component, inject, ViewChild} from '@angular/core';
import {MatSort, MatSortHeader, MatSortModule} from '@angular/material/sort';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {CursosService} from '../../services/cursos-service';
import {Router} from '@angular/router';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {CursosFiltradoPorUsuario} from '../../model/cursos-filtrado-por-usuario';
import {CommonModule} from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cursos-inscritos-component',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './cursos-inscritos-component.html',
  styleUrl: './cursos-inscritos-component.css',
})
export class CursosInscritosComponent {
  displayedColumns: string[] = ['codigoCurso', 'nombre', 'descripcion', 'accion1'];
  dataSource: MatTableDataSource<CursosFiltradoPorUsuario> =
    new MatTableDataSource<CursosFiltradoPorUsuario>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private cursoService = inject(CursosService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  ngOnInit() {
    const codigoUsuarioStr = localStorage.getItem('codigoUsuario');
    const codigoUsuario: number = codigoUsuarioStr ? Number(codigoUsuarioStr) : 0;

    this.cursoService.listarCursosPorUsuario(codigoUsuario).subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error('Error al listar cursos', err);
        this.snackBar.open('Error al cargar los cursos inscritos', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  eliminarCurso(codigoCurso: number) {
    const codigoUsuario = Number(localStorage.getItem('codigoUsuario'));
    if (confirm('¿Seguro que deseas desinscribirte de este curso?')) {
      this.cursoService
        .eliminarUsuarioCurso(codigoUsuario, codigoCurso) // <-- este método lo agregas al service
        .subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(
              (c) => c.codigoCurso !== codigoCurso
            );
            this.snackBar.open('Te desinscribiste del curso correctamente.', 'Cerrar', {
              duration: 3000,
            });
          },
          error: (err) => {
            console.error('Error al desinscribirse', err);
            this.snackBar.open('Ocurrió un error al desinscribirte.', 'Cerrar', {
              duration: 3000,
            });
          },
        });
    }
  }
}
