// @ts-ignore

import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Cursos} from '../model/cursos';
import {Nanosatelite} from '../model/nanosatelite';
import {Proyectos} from '../model/proyecto';

@Injectable({
  providedIn: 'root',
})
export class NanosateliteService {
  private url = environment.apiURL;
  private httpClient = inject(HttpClient);
  private listaCambio: Subject<Nanosatelite[]> = new Subject();

  constructor() {
  }

  registrar(nanosatelite: Omit<Nanosatelite, 'codigo'>): Observable<any> {
    const token = localStorage.getItem('token'); // Obtiene el token guardado
    const headers = {Authorization: `Bearer ${token}`}; // Cabecera JWT estándar
    return this.httpClient.post(`${this.url}/nanosatelite/registrar`, nanosatelite, {headers});
  }

  actualizar(nanosatelite: Nanosatelite): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = {Authorization: `Bearer ${token}`};
    return this.httpClient.put(`${this.url}/nanosatelite/actualizar`, nanosatelite, {headers});
  }

  eliminar(id: number): Observable<any> {
    const token = localStorage.getItem('token'); // Obtiene el token guardado
    const headers = {Authorization: `Bearer ${token}`}; // Cabecera con el token

    return this.httpClient.delete(`${this.url}/nanosatelite/eliminar/${id}`, {headers});
  }

  listar(): Observable<Nanosatelite[]> {
    const token = localStorage.getItem('token');
    const headers = {Authorization: `Bearer ${token}`};
    return this.httpClient.get<Nanosatelite[]>(`${this.url}/nanosatelite/listar`, {headers});
  }
}
