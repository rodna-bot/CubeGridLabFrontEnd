import {Usuarios} from './usuarios';
import {Cursos} from './cursos';
import {Componentes} from './componentes';
import {Nanosatelite} from './nanosatelite';

export class Proyectos {
  codigo:number;

  nombre:string;

descripcion:string;

 fecha_creacion:Date;

  cod_usuario:Partial<Usuarios>;

  cod_curso:Partial<Cursos>;

  cod_nanosatelite:Partial<Nanosatelite>;
  componentes:Partial<Componentes>[]
}
