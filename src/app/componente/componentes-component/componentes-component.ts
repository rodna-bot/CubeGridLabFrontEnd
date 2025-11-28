import {Component, inject, ViewChild} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {Router, RouterLink} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {Componentes} from '../../model/componentes';
import {ComponentesService} from '../../services/componentes-service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-componentes-component',
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
  templateUrl: './componentes-component.html',
  styleUrl: './componentes-component.css',
})
export class ComponentesComponent {
  lista: Componentes[]=[];
  displayedColumns: string[] = ['codigo','nombre','descripcion','tipo','precio','peso','consumo','accion1'];
  dataSource: MatTableDataSource<Componentes> = new MatTableDataSource<Componentes>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  componente : ComponentesService = inject(ComponentesService);
  router: Router = inject(Router);
  dialog = inject(MatDialog);
  constructor() {}
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }ngOnInit() {
    this.componente.listar().subscribe({
      next: data => {this.dataSource.data = data},
    })
  }eliminarComponente(codigo:number){
    if(confirm('Seguro que desea eliminar este componente?')){
      this.componente.eliminar(codigo).subscribe({
        next: data => {
          this.dataSource.data = this.dataSource.data.filter(c=>c.codigo !== codigo);

        },
        error: err => console.error('Error al eliminar el componente',err)
      });
    }}

}
