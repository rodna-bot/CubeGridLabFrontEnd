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
import {Usuarios} from '../../model/usuarios';
import {UsuariosService} from '../../services/usuarios-service';
import {MatDialog} from '@angular/material/dialog';
import {CursosService} from '../../services/cursos-service';
import {Cursos} from '../../model/cursos';

@Component({
  selector: 'app-cursos-component',
  imports: [
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
    MatColumnDef,
    MatHeaderRow,
    MatRow,
    MatPaginator,
    MatButton,
    RouterLink
  ],
  templateUrl: './cursos-component.html',
  styleUrl: './cursos-component.css',
})
export class CursosComponent {
  lista: Cursos[] = [];
  displayedColumns: string[] = ['codigo', 'nombre', 'descripcion', 'accion1'];
  dataSource: MatTableDataSource<Cursos> = new MatTableDataSource<Cursos>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cursoService: CursosService = inject(CursosService);
  router : Router = inject(Router);
  dialog = inject(MatDialog);

  constructor() {}
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    this.cursoService.listar().subscribe({
      next: data => {this.dataSource.data = data},
    })
  }
  eliminarCurso(codigo: number) {
    if (confirm('¿Seguro que desea eliminar este curso?')) {
      this.cursoService.eliminar(codigo).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(c => c.codigo !== codigo);
        },
        error: err => console.error('Error al eliminar curso', err)
      });
    }
  }
}
