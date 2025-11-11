import {Usuarios} from './usuarios';
import {Cursos} from './cursos';

export class Proyectos {
  codigo:number;

  private nombre:string;

  private descripcion:string;

  private fecha_creacion:Date;

  private usuarioId:Partial<Usuarios>;

  private cursoId:Partial<Cursos>;
}
