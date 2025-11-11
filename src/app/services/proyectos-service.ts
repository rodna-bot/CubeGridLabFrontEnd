import  {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Cursos} from '../model/cursos';
import {Proyectos} from '../model/proyecto';
import {Observable, Subject} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProyectosService {
  private url = environment.apiURL;
  private httpClient = inject(HttpClient);
  private listaCambio:Subject<Proyectos[]> = new Subject();
  constructor() {}
  registrar(proyecto: Proyectos) {
    const token = localStorage.getItem('token'); // Obtiene el token guardado
    const headers = { Authorization: `Bearer ${token}` }; // Cabecera JWT estándar
    return this.httpClient.post(`${this.url}/proyecto/registrar`, proyecto, { headers });
  }
  listar() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.httpClient.get<Proyectos[]>(`${this.url}/proyecto/listar`, { headers });
  }
  actualizar(proyecto: Proyectos): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.httpClient.put(`${this.url}/proyecto/actualizar`, proyecto, { headers });
  }
  eliminar(id: number): Observable<any> {
    const token = localStorage.getItem('token'); // Obtiene el token guardado
    const headers = { Authorization: `Bearer ${token}` }; // Cabecera con el token

    return this.httpClient.delete(`${this.url}/proyecto/eliminar/${id}`, { headers });
  }

}
