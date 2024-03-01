export interface Paciente {
  id: number;
  nome: string;
  cpf: number;
  dataNascimento: string;
  telefone: string[];
}

export interface CadastroPaciente {
  nome:string;
  cpf:number;
  dataNascimento:string;
  telefone:string;
}

export interface AtualizarPaciente {
  id:number;
  nome:string;
  cpf:number;
  dataNascimento:string;
  telefone:string;
}

export interface GetPaciente {
  content: Paciente[];
  totalElements:number;
  totalPages:number;
}

export class ModeloPaciente implements Paciente {
  id = -1;
  nome = '';
  cpf = -1;
  dataNascimento = '';
  telefone = [];

}

export class ModeloGetPaciente implements GetPaciente {

  content: Paciente[] = [];
  totalElements:number = 0;
  totalPages:number = 0;

}
