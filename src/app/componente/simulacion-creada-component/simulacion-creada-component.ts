import {Component, inject, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterModule} from '@angular/router';
import {SimulacionService} from '../../services/simulacion-service';
import {CommonModule} from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatButton} from '@angular/material/button';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {SimulacionTotalService} from '../../services/simulacion-total-service';
import {SimulacionTotal} from '../../model/simulacion-total';

@Component({
  selector: 'app-simulacion-creada-component',
  imports: [
    CommonModule,
    MatHeaderCellDef,
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
    RouterModule
  ],
  templateUrl: './simulacion-creada-component.html',
  styleUrl: './simulacion-creada-component.css',
})
export class SimulacionCreadaComponent {
  private route = inject(ActivatedRoute);
  private simulacionService = inject(SimulacionService);
  private simulacionTotalService = inject(SimulacionTotalService);

  codigoProyecto!: number; // ID del proyecto
  mensaje: string = '';

  displayedColumns: string[] = [
    'nombre',
    'fechaCreacion',
    'costoTotal',
    'pesoTotal',
    'consumoTotal'
  ];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    const codigoStr = this.route.snapshot.paramMap.get('codigo');
    this.codigoProyecto = codigoStr ? Number(codigoStr) : 0;

    this.registrarSimulacion();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  registrarSimulacion() {
    const simulacion = {
      nombre: `Simulación del Proyecto ${this.codigoProyecto}`,
      proyecto: { codigo: this.codigoProyecto }
    };

    this.simulacionService.registrar(simulacion).subscribe({
      next: (res) => {
        console.log('Simulación creada', res);
        this.mensaje = 'Simulación creada correctamente!';
        this.dataSource.data = [res];
      },
      error: (err) => {
        if (err.status === 403) { // Ya existe la simulación
          console.warn('Simulación ya existe, se eliminará y registrará de nuevo');

          // Buscar simulación existente
          this.simulacionTotalService.buscarPorProyecto(this.codigoProyecto)
            .subscribe({
              next: (simulacionExistente) => {
                if (simulacionExistente) {
                  // Primero eliminar
                  this.simulacionService.eliminar(simulacionExistente.codigo)
                    .subscribe({
                      next: () => {
                        console.log('Simulación eliminada');

                        // Registrar de nuevo
                        this.simulacionService.registrar(simulacion)
                          .subscribe({
                            next: (resNueva) => {
                              console.log('Simulación registrada de nuevo', resNueva);

                              this.dataSource.data = [resNueva];
                              this.mensaje = 'Simulación recreada correctamente!';
                            },
                            error: (errNueva) => {
                              console.error('Error al registrar de nuevo', errNueva);
                              this.mensaje = 'Error al registrar la simulación de nuevo';
                            }
                          });
                      },
                      error: (errEliminar) => {
                        console.error('Error al eliminar simulación existente', errEliminar);
                        this.mensaje = 'Error al eliminar simulación existente';
                      }
                    });
                }
              },
              error: (errBusqueda) => {
                console.error('Error al buscar simulación existente', errBusqueda);
                this.mensaje = 'Error al buscar simulación existente';
              }
            });

        } else {
          console.error('Error al crear simulación', err);
          this.mensaje = 'Error al crear simulación';
        }
      }
    });
  }
}
