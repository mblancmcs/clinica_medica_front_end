import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { AtualizarConsulta, Consulta, GetConsulta, MarcarConsulta, getModeloConsulta, getModeloGetConsulta } from '../../models/consulta-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  private api = 'http://localhost:8080/consulta';
  private consultasSubject = new BehaviorSubject<GetConsulta>(new getModeloGetConsulta());
  private mensagemErro = new Subject<any>();
  // private consultasPorCpfSubject = new BehaviorSubject<GetConsulta>(new getModeloConsulta());
  public consultas$ = this.consultasSubject.asObservable();
  // public consultasPorCpf$ = this.consultasPorCpfSubject.asObservable();
  public mensagemErro$ = this.mensagemErro.asObservable();
  public dadoCompartilhadoSubject = new Subject<Consulta>();

  consultaCadastrada:Consulta = new getModeloConsulta();

  constructor(private http:HttpClient) { }

  listarConsultas(pagina?:number): void {
    let params = new HttpParams();
    if(pagina) {
      params = params.append('page', pagina);
    }
    this.http.get<GetConsulta>(this.api, {params}).subscribe((consultas) => {
      let consultasTemporarias = this.consultasSubject.getValue();
      consultasTemporarias = consultas;
      consultasTemporarias.content = consultas.content
        .filter(consulta => consulta.id !== -1);
      this.consultasSubject.next(consultasTemporarias);
    })
  }

  listarConsultasPorCpf(cpf:number, pagina?:number): Observable<GetConsulta> {
    let params = new HttpParams();
    if(pagina) {
      params = params.append('page', pagina);
    }
    /* this.http.get<GetConsulta>(`${this.api}/cpf=${cpf}`, {params}).subscribe((consultas) => {
      let consultasTemporarias = this.consultasPorCpfSubject.getValue();
      consultasTemporarias = consultas;
      consultasTemporarias.content = consultas.content
        .filter(consulta => consulta.id !== -1);
      this.consultasPorCpfSubject.next(consultasTemporarias);
    }); */
    return this.http.get<GetConsulta>(`${this.api}/cpf=${cpf}`, {params});
  }

  listarConsultasPorData(data:string, pagina?:number): Observable<GetConsulta> {
    const params = new HttpParams();
    if(pagina) {
      params.append('page', pagina);
    }
    return this.http.get<GetConsulta>(`${this.api}/data=${data}`, {params});
  }

  cadastrarConsulta(consulta:MarcarConsulta): void {
    this.http.post<Consulta>(this.api, consulta).subscribe({
      next: (consulta) => {
        let consultasTemporarias = this.consultasSubject.getValue();
        consultasTemporarias.content.unshift(consulta);
        this.consultasSubject.next(consultasTemporarias);
        this.setDadoCompartilhado(consulta);
      },
      error: (erro) => {
        this.mensagemErro.next(erro.error);
        return throwError(erro);
      }
    });
  }

  cadastrarConsultaDoDia(consulta:MarcarConsulta): void {
    this.http.post<Consulta>(`${this.api}/no_dia`, consulta).subscribe({
      next: (consulta) => {
        let consultasTemporarias = this.consultasSubject.getValue();
        consultasTemporarias.content.unshift(consulta);
        this.consultasSubject.next(consultasTemporarias);
        this.setDadoCompartilhado(consulta);
      }, // ver sobre o tratamento
      error: (erro) => { // deve ser melhor chamar o modal aqui pelo menos por enquanto ou definitivo, não sei
        this.mensagemErro.next(erro.error);
        return throwError(erro);
      }
    });
  }

  atualizarConsulta(consultaForm: AtualizarConsulta): void {
    this.http.put<Consulta>(this.api, consultaForm).subscribe((consultaAtz) => {
      let consultasTemporarias = this.consultasSubject.getValue();
      let index = consultasTemporarias.content.findIndex(consulta => consulta.id == consultaAtz.id);
      if(index !== -1) {
        consultasTemporarias.content[index] = consultaAtz;
        this.consultasSubject.next(consultasTemporarias);
      }
    });
  }

  inativarConsulta(id:number): void {
    this.http.delete(`${this.api}/id=${id}`).subscribe(() => {
      let consultasTemporarias = this.consultasSubject.getValue();
      const index = consultasTemporarias.content.findIndex(consulta => consulta.id === id);
      if(index !== -1) {
        consultasTemporarias.content.splice(index, 1);
        this.consultasSubject.next(consultasTemporarias);
      }
    });
  }

  getDadoCompartilhado() {
    return this.dadoCompartilhadoSubject.asObservable();
  }

  setDadoCompartilhado(consulta:Consulta) {
    this.dadoCompartilhadoSubject.next(consulta);
  }

}
