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
import {MatButton} from '@angular/material/button';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Usuarios} from '../../model/usuarios';
import {UsuariosService} from '../../services/usuarios-service';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-usuarios-component',
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
  templateUrl: './usuarios-component.html',
  styleUrl: './usuarios-component.css',
})
export class UsuariosComponent {
  lista: Usuarios[] = [];
  displayedColumns: string[] = ['codigo', 'username', 'password', 'accion1'];
  dataSource: MatTableDataSource<Usuarios> = new MatTableDataSource<Usuarios>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  usuariosService: UsuariosService = inject(UsuariosService);
  router : Router = inject(Router);
  dialog = inject(MatDialog);

  constructor() {}
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    this.usuariosService.listar().subscribe({
      next: data => {this.dataSource.data = data},
    })
  }
  eliminarUsuario(codigo: number) {
    if (confirm('¿Seguro que desea eliminar este usuario?')) {
      this.usuariosService.eliminar(codigo).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(u => u.codigo !== codigo);
        },
        error: err => console.error('Error al eliminar usuario', err)
      });
    }
  }
}
