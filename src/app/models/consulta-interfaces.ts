import { catchError } from 'rxjs';
import { Paciente } from "./paciente-intefaces";

export interface Consulta {
  id:number;
  data:string;
  senha:number;
  planoParticular:string;
  motivo:string;
  dadosPaciente: Paciente;
}

export interface GetConsulta {
  content: Consulta[];
  totalElements:number;
  totalPages:number;
  catchError?:any;
}

export interface AtualizarConsulta {
  id:number;
  data:string;
  senha:number;
  planoParticular:string;
  motivo:string;
}

export interface MarcarConsulta {
  planoParticular:string;
  data?:string;
  idPaciente:number;
  motivo:string;
}

export class getModeloGetConsulta implements GetConsulta {

  content:Consulta[] = [];
  totalElements = 0;
  totalPages = 0;

}

export class getModeloConsulta implements Consulta {

  id = -1;
  data = '';
  senha = -1;
  planoParticular = '';
  motivo = '';
  dadosPaciente = {
    id: -1,
    nome: '',
    cpf: -1,
    dataNascimento: '',
    telefone: []
  };

}
