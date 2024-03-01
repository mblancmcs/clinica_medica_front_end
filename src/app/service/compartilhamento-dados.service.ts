import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cabecalho, ModeloCabecalho } from '../componentes/cabecalho/cabecalho-interface';

@Injectable({
  providedIn: 'root'
})
export class CompartilhamentoDadosService {

  private cpfSubject = new BehaviorSubject<string>('');
  private cabecalhoAtendenteInfoSubject = new BehaviorSubject<Cabecalho>(new ModeloCabecalho())
  private cabecalhoMedicoInfoSubject = new BehaviorSubject<Cabecalho>(new ModeloCabecalho())
  private cabecalhoAdminInfoSubject = new BehaviorSubject<Cabecalho>(new ModeloCabecalho())

  getCpf() {
    return this.cpfSubject.asObservable();
  }

  setCpf(cpfInput: string) {
    this.cpfSubject.next(cpfInput);
  }

  getCabecalhoAdminInfo() {
    return this.cabecalhoAdminInfoSubject.asObservable();
  }

  setCabecalhoAdminInfo(cabecalhoInfo:Cabecalho) {
    this.cabecalhoAdminInfoSubject.next(cabecalhoInfo);
  }

  getCabecalhoMedicoInfo() {
    return this.cabecalhoMedicoInfoSubject.asObservable();
  }

  setCabecalhoMedicoInfo(cabecalhoInfo:Cabecalho) {
    this.cabecalhoMedicoInfoSubject.next(cabecalhoInfo);
  }

  getCabecalhoAtendenteInfo() {
    return this.cabecalhoAtendenteInfoSubject.asObservable();
  }

  setCabecalhoAtendenteInfo(cabecalhoInfo:Cabecalho) {
    this.cabecalhoAtendenteInfoSubject.next(cabecalhoInfo);
  }

}
