export interface Cabecalho {
  titulo:string;
  btn:string;
  rota:string;
}

export class ModeloCabecalho implements Cabecalho {
  titulo = '';
  btn = '';
  rota = '';
}
