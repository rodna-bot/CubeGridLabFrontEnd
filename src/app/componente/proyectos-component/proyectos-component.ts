import {Component, inject, ViewChild} from '@angular/core';
import {Proyectos} from '../../model/proyecto';
import {
  MatHeaderCellDef,
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {Router, RouterLink, RouterModule} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ProyectosService} from '../../services/proyectos-service';
import {MatButton} from '@angular/material/button';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-proyectos-component',
  imports: [
    CommonModule,
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
    RouterLink,
    RouterModule
  ],
  templateUrl: './proyectos-component.html',
  styleUrl: './proyectos-component.css',
})
export class ProyectosComponent {
lista: Proyectos[] =[];
displayedColumns: string[] = ['codigo', 'nombre', 'descripcion','fecha-creacion','codigo-usuario','codigo-curso','codigo-nanosatelite','componentes','accion1'];
dataSource: MatTableDataSource<Proyectos> = new MatTableDataSource<Proyectos>();
@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;
proyectoService: ProyectosService = inject(ProyectosService);
router : Router = inject(Router);
cod_usuario: number;
dialog = inject(MatDialog);
  constructor() {

  }

  ngOnInit() {
    const codigoUsuarioStr = localStorage.getItem('codigoUsuario');
    const codigoUsuario: number = codigoUsuarioStr ? Number(codigoUsuarioStr) : 0;
    this.cod_usuario = codigoUsuario;

   this.proyectoService.listarPorUsuario(this.cod_usuario).subscribe({
      next: (data) => {this.dataSource.data = data},
    })
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  eliminarProyecto(codigo: number ) {
    if (confirm('Seguro que deseas eliminar este proyecto?')) {
      this.proyectoService.eliminar(codigo).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(p => p.codigo !== codigo);
        },
        error: err => console.error('Error al eliminar proyecto', err)
      });
    }}}
