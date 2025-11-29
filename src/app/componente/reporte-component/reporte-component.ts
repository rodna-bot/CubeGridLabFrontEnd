import {Component} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {ChartData, ChartOptions} from 'chart.js';
import {NgChartsModule} from 'ng2-charts';

@Component({
  selector: 'app-reporte-component',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    NgChartsModule
  ],
  templateUrl: './reporte-component.html',
  styleUrl: './reporte-component.css',
})
export class ReporteComponent{
  reporte: any;

  // Labels del eje horizontal
  barChartLabels: string[] = ['Costo', 'Peso', 'Consumo'];

  // Datos del gráfico tipado como 'bar'
  barChartData: ChartData<'bar', number[], string> = {
    labels: this.barChartLabels,
    datasets: [
      {
        data: [0, 0, 0], // valores iniciales para evitar que aparezca vacío
        label: 'Promedio',
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc']
      }
    ]
  };

  // Opciones del gráfico
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false, position: 'top' }
    },
    scales: {
      x: { title: { display: true, text: 'Indicador' } },
      y: { title: { display: true, text: 'Promedio' } }
    }
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarReporte();
  }

  cargarReporte() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get('http://localhost:8081/api/simulacion/reporte/1', { headers })
      .subscribe({
        next: (data: any) => {
          this.reporte = data;
          this.actualizarGrafico(data);
        },
        error: (err) => console.error('ERROR', err)
      });
  }

  actualizarGrafico(data: any) {
    this.barChartData = {
      labels: this.barChartLabels,
      datasets: [
        {
          data: [
            Number(data.promedioCosto),
            Number(data.promedioPeso),
            Number(data.promedioConsumo)
          ],
          label: 'Promedio',
          backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc']
        }
      ]
    };
  }


}
