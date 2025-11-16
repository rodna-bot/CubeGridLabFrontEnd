import {Component, inject, ViewChild} from '@angular/core';
import {Cursos} from '../../model/cursos';
import {
  MatCell, MatCellDef, MatColumnDef, MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {Router, RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {Nanosatelite} from '../../model/nanosatelite';
import {NanosateliteService} from '../../services/Nanosatelite-service';
import {MatButton} from '@angular/material/button';


@Component({
  selector: 'app-nanosatelite-component',
  imports: [
    MatHeaderCellDef,
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    RouterLink
  ],
  templateUrl: './nanosatelite-component.html',
  styleUrl: './nanosatelite-component.css',
})
export class NanosateliteComponent {
  lista: Nanosatelite[] = [];
  displayedColumns: string[] = ['codigo', 'tipo', 'precio' ,'accion1'];
  dataSource: MatTableDataSource<Nanosatelite> = new MatTableDataSource<Nanosatelite>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  nanosatelite: NanosateliteService = inject(NanosateliteService);
  router : Router = inject(Router);
  dialog = inject(MatDialog);
  constructor() {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    this.nanosatelite.listar().subscribe({
      next: data => {this.dataSource.data = data},
    })
  }

   eliminarNanosatelite(codigo: number) {
    if (confirm('¿Seguro que desea eliminar este nanosatelite?')) {
      this.nanosatelite.eliminar(codigo).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(n => n.codigo !== codigo);
        },
        error: err => console.error('Error al eliminar el nanosatelite', err)
      });
    }
  }}
