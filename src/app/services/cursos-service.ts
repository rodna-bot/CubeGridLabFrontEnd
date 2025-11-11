import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Cursos} from '../model/cursos';
import {Usuarios} from '../model/usuarios';
import {UsuariosCursos} from '../model/usuarios-cursos';
import {CursosFiltradoPorUsuario} from '../model/cursos-filtrado-por-usuario';

@Injectable({
  providedIn: 'root',
})
export class CursosService {
  private url = environment.apiURL;
  private httpClient = inject(HttpClient);
  private listaCambio: Subject<Cursos[]> = new Subject();

  constructor() {}
  registrar(curso: Cursos): Observable<any> {
    const token = localStorage.getItem('token'); // Obtiene el token guardado
    const headers = { Authorization: `Bearer ${token}` }; // Cabecera JWT estándar
    return this.httpClient.post(`${this.url}/curso/registrar`, curso, { headers });
  }

  actualizar(curso: Cursos): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.httpClient.put(`${this.url}/curso/actualizar`, curso, { headers });
  }
  eliminar(id: number): Observable<any> {
    const token = localStorage.getItem('token'); // Obtiene el token guardado
    const headers = { Authorization: `Bearer ${token}` }; // Cabecera con el token

    return this.httpClient.delete(`${this.url}/curso/eliminar/${id}`, { headers });
  }
  listar(): Observable<Cursos[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.httpClient.get<Cursos[]>(`${this.url}/curso/listar`, { headers });
  }
  registrarUsuarioCurso(usuarioCurso: UsuariosCursos): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.httpClient.post(`${this.url}/UsuarioCurso/registrar`, usuarioCurso, { headers });
  }
  listarCursosPorUsuario(codigoUsuario: number): Observable<CursosFiltradoPorUsuario[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.httpClient.get<CursosFiltradoPorUsuario[]>(
      `${this.url}/UsuarioCurso/cursosDeUsuario/${codigoUsuario}`,
      { headers }
    );
  }
  eliminarUsuarioCurso(codigoUsuario: number, codigoCurso: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.httpClient.delete(
      `${this.url}/UsuarioCurso/eliminar/${codigoUsuario}/${codigoCurso}`,
      { headers }
    );
  }
}
