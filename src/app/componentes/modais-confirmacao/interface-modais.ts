import { AtualizarAtendimento } from "../../models/atendimento-interfaces"
import { AtualizarConsulta, Consulta, MarcarConsulta } from "../../models/consulta-interfaces"
import { AtualizarPaciente } from "../../models/paciente-intefaces"
import { Usuario } from "../../models/usuario-interface"

export interface ConfirmModal {
  titulo:string,
  mensagem:string,
  class:string,
}

export interface AtendimentoModal {
  titulo:string,
  mensagem:string,
  confirmacao:string,
  atendimento:AtualizarAtendimento
}

export interface ConsultaModal {
  titulo:string,
  mensagem:string,
  confirmacao:string,
  consulta:AtualizarConsulta | MarcarConsulta
}

export interface PacienteModal {
  titulo:string,
  mensagem:string,
  confirmacao:string,
  paciente:AtualizarPaciente
}

export interface UsuarioModal {
  titulo:string,
  mensagem:string,
  confirmacao:string,
  usuario:Usuario
}
