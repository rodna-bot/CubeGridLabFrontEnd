import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Usuarios} from '../model/usuarios';
import {Roles} from '../model/roles';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private url = environment.apiURL;
  private httpClient = inject(HttpClient);
  private listaCambio: Subject<Usuarios[]> = new Subject();

  constructor() {}
  registrar(rol: Roles): Observable<any> {
    const token = localStorage.getItem('token'); // obtiene el token guardado al iniciar sesión
    const headers = { Authorization: `Bearer ${token}` }; // cabecera JWT estándar
    return this.httpClient.post(this.url + "/rol/registrar", rol, { headers });
  }
  listar(): Observable<Roles[]> {
    const token = localStorage.getItem('token'); // obtiene el token guardado al iniciar sesión
    const headers = { Authorization: `Bearer ${token}` }; // cabecera JWT estándar

    return this.httpClient.get<Roles[]>(`${this.url}/rol/listar`, { headers });
  }
}
