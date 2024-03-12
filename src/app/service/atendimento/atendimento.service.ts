import { GetAtendimentos, modeloGetAtendimentos } from './../../models/atendimento-interfaces';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Atendimento, AtualizarAtendimento } from '../../models/atendimento-interfaces';

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService {

  private readonly api = 'http://localhost:8080/atendimento';
  private atendimentosSubject = new BehaviorSubject<GetAtendimentos>(new modeloGetAtendimentos());
  private atendimentosPorCpfSubject = new BehaviorSubject<GetAtendimentos>( new modeloGetAtendimentos());
  private atendimentosPorDataSubject = new BehaviorSubject<GetAtendimentos>(new modeloGetAtendimentos());
  public atendimentos$ = this.atendimentosSubject.asObservable();
  public atendimentosPorCpf$ = this.atendimentosPorCpfSubject.asObservable();
  public atendimentosPorData$ = this.atendimentosPorDataSubject.asObservable();

  constructor(private http:HttpClient) { }

  listarAtendimentos(pagina?:number):void {
    let params = new HttpParams();
    if(pagina) {
      params = params.append('page', pagina);
    }
    this.http.get<GetAtendimentos>(this.api, {params}).subscribe(
      {
        next: (atendimentos) => {
            this.atendimentosSubject.next(atendimentos);
        },
        error: (erro) => {
          console.log(erro);
        }
      })
  }

  listarAtendimentosPorCpf$(cpf:number, pagina?:number): void {
    let params = new HttpParams();
    if(pagina) {
      params = params.append('page', pagina);
    }
    let dataAtual = new Date().toISOString().slice(0, 10);
    this.http.get<GetAtendimentos>(`${this.api}/cpf=${cpf}`, {params}).subscribe((atendimentos) => {
      let atendimentosTemporarios = atendimentos;
      console.log(atendimentos);
      atendimentosTemporarios.content = atendimentos.content.filter(atendimento =>
        atendimento.id !== -1 && atendimento.consulta.data.slice(0, 10) !== dataAtual)
      console.log(atendimentos);
      console.log(atendimentosTemporarios);
      this.atendimentosPorCpfSubject.next(atendimentosTemporarios);
    })
  }

  listarAtendimentosPorCpf(cpf:number, pagina?:number): Observable<GetAtendimentos> {
    let params = new HttpParams();
    if(pagina) {
      params = params.append('page', pagina);
    }
    return this.http.get<GetAtendimentos>(`${this.api}/cpf=${cpf}`, {params});
    /* this.http.get<GetAtendimentos>(`${this.api}/cpf=${cpf}`, {params}).subscribe((atendimentos) => {
       let atendimentosTemporarios = this.atendimentosPorCpfSubject.getValue();
      atendimentosTemporarios.content = atendimentosTemporarios.content
        .filter(atendimento => atendimento.id !== -1).concat(atendimentos.content);
      this.atendimentosPorCpfSubject.next(atendimentos);
    }) */
  }

  listarAtendimentosPorData(data:string):void {
    this.http.get<GetAtendimentos>(`${this.api}/data=${data}`).subscribe({
      next: (atendimentos) => {
        let atendimentosTemporarios = atendimentos;
        atendimentosTemporarios.content = atendimentos.content
          .filter(atendimento => atendimento.id !== -1);
        this.atendimentosPorDataSubject.next(atendimentosTemporarios);
      },
      error: (erro) => {
        console.log(erro);
      }
    })
  }

  atualizarAtendimento(atendimento_form: AtualizarAtendimento, data?:boolean, cpf?:boolean): void {
    this.http.put<Atendimento>(this.api, atendimento_form).subscribe((atendimento_atz) => {
      let atendimentos = new modeloGetAtendimentos();
      if(data) atendimentos = this.atendimentosPorDataSubject.getValue();
      else if(cpf) atendimentos = this.atendimentosPorCpfSubject.getValue();
      else atendimentos = this.atendimentosSubject.getValue();

      const index = atendimentos.content.findIndex(atendimento => atendimento.id === atendimento_atz.id);
      if(index === -1) {
        return;
      }
      atendimentos.content[index] = atendimento_atz;

      if(data) this.atendimentosPorDataSubject.next(atendimentos);
      else if(cpf) this.atendimentosPorCpfSubject.next(atendimentos);
      else this.atendimentosSubject.next(atendimentos);
    });
  }

  inativarAtendimento(id:number):void {
    this.http.delete(`${this.api}/id=${id}`).subscribe(() => {
      let atendimentosTemporarios = this.atendimentosSubject.getValue();
      const index = atendimentosTemporarios.content.findIndex(atendimento => atendimento.id === id);
      if(index !== -1) {
        atendimentosTemporarios.content.splice(index, 1);
        this.atendimentosSubject.next(atendimentosTemporarios);
      }
    });
  }

}
