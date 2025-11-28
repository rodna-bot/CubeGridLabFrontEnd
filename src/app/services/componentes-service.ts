import {Component, inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable, Subject} from 'rxjs';
import {Nanosatelite} from '../model/nanosatelite';
import {Componentes} from '../model/componentes';
import {Cursos} from '../model/cursos';

@Injectable({
  providedIn: 'root'
})
export class ComponentesService{
  private url = environment.apiURL;
  private httpClient = inject(HttpClient);
  private  listaCambio: Subject<Componentes[]> = new Subject();
  constructor(){}
  registrar(componente:Omit<Componentes, 'codigo'>): Observable<any>  {
    const token = localStorage.getItem('token');
    const headers = {Authorization: `Bearer ${token}`};
    return this.httpClient.post(`${this.url}/componente/registrar`,componente,{headers});}

  actualizar(componente:Componentes): Observable<any>  {
    const token = localStorage.getItem('token');
    const headers = {Authorization: `Bearer ${token}`};
    return this.httpClient.put(`${this.url}/componente/actualizar`,componente,{headers});}

  eliminar(id: number): Observable<any> {
    const token = localStorage.getItem('token'); // Obtiene el token guardado
    const headers = { Authorization: `Bearer ${token}` }; // Cabecera con el token
    return this.httpClient.delete(`${this.url}/componente/eliminar/${id}`, { headers });}

  listar(): Observable<Componentes[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.httpClient.get<Componentes[]>(`${this.url}/componente/listar`, { headers });
  }
}

