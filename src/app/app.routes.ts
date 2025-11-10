import { Routes } from '@angular/router';
import {CursosComponent} from './componente/cursos-component/cursos-component';
import {UsuariosComponent} from './componente/usuarios-component/usuarios-component';
import {ProyectosComponent} from './componente/proyectos-component/proyectos-component';
import {RegistrarUsuarioComponent} from './componente/registrar-usuario-component/registrar-usuario-component';
import {IniciarSesionComponent} from './componente/iniciar-sesion-component/iniciar-sesion-component';
import {InicioComponent} from './componente/inicio-component/inicio-component';
import {AgregarUsuarioComponent} from './componente/agregar-usuario-component/agregar-usuario-component';
import {EditarUsuarioComponent} from './componente/editar-usuario-component/editar-usuario-component';
import {RegistrarRol} from './componente/registrar-rol/registrar-rol';
import {EditarCursoComponente} from './componente/editar-curso-componente/editar-curso-componente';
import {AgregarCursoComponente} from './componente/agregar-curso-componente/agregar-curso-componente';
import {
  AsignarUsuarioCursoComponent
} from './componente/asignar-usuario-curso-component/asignar-usuario-curso-component';
import {CursosUserComponent} from './componente/cursos-user-component/cursos-user-component';
import {InscribirseCursoComponent} from './componente/inscribirse-curso-component/inscribirse-curso-component';
import {CursosInscritosComponent} from './componente/cursos-inscritos-component/cursos-inscritos-component';

export const routes: Routes = [
  {path: '' , component: IniciarSesionComponent, pathMatch: 'full'},
  {path: 'registrar-usuario', component: RegistrarUsuarioComponent},
  {path: 'inicio', component: InicioComponent},
  {path: 'usuarios', component: UsuariosComponent},
  {path: 'agregar-usuario', component: AgregarUsuarioComponent},
  {path: 'editar-usuario/:codigo', component: EditarUsuarioComponent },
  {path: 'gestionar-rol', component: RegistrarRol },
  {path: 'cursos', component: CursosComponent},
  {path: 'agregar-curso', component: AgregarCursoComponente},
  {path: 'editar-curso/:codigo', component: EditarCursoComponente },
  {path: 'asignar-usuario-curso', component: AsignarUsuarioCursoComponent },
  {path: 'cursos-user', component: CursosUserComponent},
  {path: 'inscribirse-curso', component: InscribirseCursoComponent},
  {path: 'cursos-inscritos', component: CursosInscritosComponent},
  {path: 'proyectos', component: ProyectosComponent},
];
