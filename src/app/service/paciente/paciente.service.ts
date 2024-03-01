import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { AtualizarPaciente, CadastroPaciente, GetPaciente, ModeloGetPaciente, Paciente } from '../../models/paciente-intefaces';
import { HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private api = 'http://localhost:8080/paciente';
  private pacientesSubject = new BehaviorSubject<GetPaciente>(new ModeloGetPaciente());
  private mensagemErroSubject = new Subject<string>();
  private dadoCompartilhadoSubject = new Subject<Paciente>();
  pacientes$ = this.pacientesSubject.asObservable(); // para ser usado no template com o "| async" e alterar quando houver mudanças

  constructor(private http:HttpClient) { }

  listarPacientes(pagina?:number):void { // como está usando o BehaviorSubject, o array será modificado quando houver mudanças, não retornando um observable
    let params = new HttpParams();
    if(pagina) {
      params = params.append('page', pagina);
    }
    this.http.get<GetPaciente>(this.api, {params}).subscribe((pacientes) => {
      let pacientesTemporarios = pacientes;
      pacientesTemporarios.content = pacientesTemporarios.content
        .filter(paciente => paciente.id !== -1);
      this.pacientesSubject.next(pacientesTemporarios);
    });
  }

  listarPaciente(id:string):Observable<Paciente> {
    return this.http.get<Paciente>(`${this.api}/id=${id}`);
  }

  listarPacientePorCpf(cpf:number): Observable<Paciente> {
    let params:HttpParams = new HttpParams();
    return this.http.get<Paciente>(`${this.api}/cpf=${cpf}`, {params});
  }

  listarPacientesPorCpf(cpf:number, pagina?:number): Observable<GetPaciente> | Observable<any> {
    let params = new HttpParams();
    if(pagina) {
      params = params.append('page', pagina);
    }
    if(!cpf) return new Observable<any>;
    return this.http.get<GetPaciente>(`${this.api}/pacientes_cpf=${cpf}`, {params});
  }

  cadastrarPaciente(paciente:CadastroPaciente): void {
    this.http.post<Paciente>(this.api, paciente).subscribe({
      next: (paciente) => {
        let pacientesTemporarios = this.pacientesSubject.getValue();
        pacientesTemporarios.content.unshift(paciente);
        this.pacientesSubject.next(pacientesTemporarios);
        this.dadoCompartilhadoSubject.next(paciente);
      },
      error: (erro) => {
        this.mensagemErroSubject.next(erro.error);
        return throwError(erro);
      }
    });
  }

  atualizarPaciente(pacienteForm:AtualizarPaciente): void {
    this.http.put<Paciente>(this.api, pacienteForm).subscribe((pacienteAtz) => {
      let pacientesTemporarios = this.pacientesSubject.getValue();
      let index = pacientesTemporarios.content.findIndex(paciente => paciente.id === pacienteAtz.id);
      if(index !== -1) {
        pacientesTemporarios.content[index] = pacienteAtz;
        this.pacientesSubject.next(pacientesTemporarios);
      }
    });
  }

  inativarPaciente(id:number): void {
    this.http.delete(`${this.api}/id=${id}`).subscribe(() => {
      let pacientesTemporarios = this.pacientesSubject.getValue();
      const index = pacientesTemporarios.content.findIndex(paciente => paciente.id === id);
      if(index !== -1) {
        pacientesTemporarios.content.splice(index, 1);
        this.pacientesSubject.next(pacientesTemporarios);
      }
    });
  }

  getMensagemErro() {
    return this.mensagemErroSubject.asObservable();
  }

  setMensagemErro(mensagemErro:string) {
    this.mensagemErroSubject.next(mensagemErro);
  }

  getDadoCompartilhado() {
    return this.dadoCompartilhadoSubject.asObservable();
  }

  setDadoCompartilhado(dadoCompartilhado:Paciente) {
    this.dadoCompartilhadoSubject.next(dadoCompartilhado);
  }

}
