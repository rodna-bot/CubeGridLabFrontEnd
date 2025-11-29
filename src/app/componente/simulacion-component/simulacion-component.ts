import {Component, inject, ViewChild} from '@angular/core';
import {Proyectos} from '../../model/proyecto';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {ProyectosService} from '../../services/proyectos-service';
import {Router, RouterLink, RouterModule} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-simulacion-component',
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
  templateUrl: './simulacion-component.html',
  styleUrl: './simulacion-component.css',
})
export class SimulacionComponent {
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

}
