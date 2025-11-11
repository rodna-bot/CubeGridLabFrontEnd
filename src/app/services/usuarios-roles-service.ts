import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Usuarios} from '../model/usuarios';
import {Roles} from '../model/roles';
import {UsuariosRoles} from '../model/usuarios-roles';

@Injectable({
  providedIn: 'root',
})
export class UsuariosRolesService {
  private url = environment.apiURL;
  private httpClient = inject(HttpClient);
  private listaCambio: Subject<Usuarios[]> = new Subject();

  constructor() {}
  registrar(userId: number, rolId: number): Observable<any> {
    const token = localStorage.getItem('token'); // obtiene el token guardado al iniciar sesión
    const headers = { Authorization: `Bearer ${token}` }; // cabecera JWT
    return this.httpClient.post(
      `${this.url}/usuariosRoles/registrar/${userId}/${rolId}`,
      null,
      { headers }
    );
  }
}
