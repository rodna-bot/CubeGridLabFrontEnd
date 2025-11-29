import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {Simulacion} from '../model/simulacion';
import {SimulacionTotal} from '../model/simulacion-total';

@Injectable({
  providedIn: 'root',
})
export class SimulacionTotalService {
  private url = environment.apiURL;
  private httpClient = inject(HttpClient);
  private listaCambio:Subject<Simulacion[]> = new Subject();
  constructor() {}

  actualizar(simulacion: SimulacionTotal) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.httpClient.put(`${this.url}/simulacion/actualizar`, simulacion, { headers });
  }

  buscarPorProyecto(codigoProyecto: number) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.httpClient.get<SimulacionTotal | null>(`${this.url}/simulacion/buscar/${codigoProyecto}`, { headers });
  }
}
