import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Proyectos} from '../model/proyecto';
import {Simulacion} from '../model/simulacion';

@Injectable({
  providedIn: 'root',
})
export class SimulacionService {
  private url = environment.apiURL;
  private httpClient = inject(HttpClient);
  private listaCambio:Subject<Simulacion[]> = new Subject();
  constructor() {}
  registrar(simulacion: Partial<Simulacion>) {
    const token = localStorage.getItem('token'); // Obtiene el token guardado
    const headers = { Authorization: `Bearer ${token}` }; // Cabecera JWT estándar
    return this.httpClient.post(`${this.url}/simulacion/registrar`, simulacion, { headers });
  }
  listar() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.httpClient.get<Simulacion[]>(`${this.url}/simulacion/listar`, { headers });
  }

  eliminar(id: number): Observable<any> {
    const token = localStorage.getItem('token'); // Obtiene el token guardado
    const headers = { Authorization: `Bearer ${token}` }; // Cabecera con el token

    return this.httpClient.delete(`${this.url}/simulacion/eliminar/${id}`, { headers });
  }

}
