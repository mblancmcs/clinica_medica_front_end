export interface Cabecalho {
  titulo:string;
  tituloBtn:string;
  btn:string;
  rota:string;
}

export class ModeloCabecalho implements Cabecalho {
  titulo = '';
  tituloBtn = '';
  btn = '';
  rota = '';
}
