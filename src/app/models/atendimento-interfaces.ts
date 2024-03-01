import { Consulta } from "./consulta-interfaces";

export interface GetAtendimentos {
  content: Atendimento[];
  totalElements:number;
  totalPages:number;
}

export interface Atendimento {
  id: number;
  diagnostico: string;
  receitaRemedios: string;
  solicitacaoRetorno: string;
  complemento: string;
  consulta: Consulta;
}

export interface AtualizarAtendimento {
  id: number;
  diagnostico: string;
  receitaRemedios:string;
  solicitacaoRetorno:string;
  complemento:string;
}

export class modeloGetAtendimentos implements GetAtendimentos {

  content: Atendimento[] = [];
  totalElements = 0;
  totalPages = 0;

}

export class modeloAtendimento implements Atendimento {

  id = -1;
  diagnostico = '';
  receitaRemedios = '';
  solicitacaoRetorno = '';
  complemento = '';
  consulta = {
    id: -1,
    data: "",
    senha: -1,
    planoParticular: "",
    motivo: "",
    dadosPaciente: {
      id: -1,
      nome: '',
      cpf: -1,
      dataNascimento: "",
      telefone: []
    }
  }

}
