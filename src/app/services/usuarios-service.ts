import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Usuarios} from '../model/usuarios';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private url = environment.apiURL;
  private httpClient = inject(HttpClient);
  private listaCambio: Subject<Usuarios[]> = new Subject();
  constructor() {}
  registrar(usuario: Usuarios): Observable<any> {
    const token = localStorage.getItem('token'); // obtiene el token guardado al iniciar sesión
    const headers = { Authorization: `Bearer ${token}` }; // cabecera JWT estándar
    return this.httpClient.post(this.url + "/usuario/registrar", usuario, { headers });
  }
  actualizar(usuario: Usuarios): Observable<any> {
    const token = localStorage.getItem('token'); // obtener el token guardado
    const headers = { Authorization: `Bearer ${token}` }; // cabecera con JWT
    return this.httpClient.put(this.url + "/usuario/actualizar", usuario, { headers });
  }
  eliminar(id: number): Observable<any> {
    const token = localStorage.getItem('token'); // obtener el token guardado
    const headers = { Authorization: `Bearer ${token}` }; // cabecera con JWT
    return this.httpClient.delete(this.url + "/usuario/eliminar/" + id, { headers });
  }
  listar(): Observable<Usuarios[]> {
    const token = localStorage.getItem('token'); // obtiene el token guardado al iniciar sesión
    const headers = { Authorization: `Bearer ${token}` }; // cabecera JWT estándar

    return this.httpClient.get<Usuarios[]>(`${this.url}/usuario/listar`, { headers });
  }
  autenticarToken(usuario: Usuarios): Observable<{ jwt: string; roles: string[] }> {
    return this.httpClient.post<{ jwt: string; roles: string[] }>(
      this.url + '/authenticate',
      usuario
    );
  }
  obtenerCodigo(username: string): Observable<number> {
    const token = localStorage.getItem('token'); // obtener el token guardado
    const headers = { Authorization: `Bearer ${token}` }; // cabecera con JWT
    return this.httpClient.get<number>(`${this.url}/usuario/obtenerCodigo/${username}`, { headers });
  }
}
