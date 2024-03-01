import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CompartilhamentoDadosService } from '../../service/compartilhamento-dados.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cabecalho } from './cabecalho-interface';
import { MatIconModule } from '@angular/material/icon';
import { AutenticacaoService } from '../../service/autenticacao/autenticacao.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cabecalho',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './cabecalho.component.html',
  styleUrl: './cabecalho.component.css'
})
export class CabecalhoComponent implements OnInit, OnDestroy {

  cabecalhoAdminInfo:Cabecalho = {
    titulo: 'Página administrativa',
    btn: 'shield_person',
    rota: 'admin'
  }
  cabecalhoMedicoInfo:Cabecalho = {
    titulo: 'Atendimentos',
    btn: 'stethoscope',
    rota: 'atendimento'
  }
  cabecalhoAtendenteInfo:Cabecalho = {
    titulo: 'Consultas',
    btn: 'splitscreen_add',
    rota: 'consulta'
  }
  titulo = '';
  role = localStorage.getItem('role');
  dadosCompartilhadosSubscription: Subscription = new Subscription();
  class = '';

  constructor(
    private dadosCompartilhadosService:CompartilhamentoDadosService,
    private auth: AutenticacaoService,
    private route:Router
  ) {}

  ngOnInit(): void {
    localStorage.setItem('cabecalhoAdminInfo', JSON.stringify(this.cabecalhoAdminInfo));
    localStorage.setItem('cabecalhoAtendenteInfo', JSON.stringify(this.cabecalhoAtendenteInfo));
    localStorage.setItem('cabecalhoMedicoInfo', JSON.stringify(this.cabecalhoMedicoInfo));
    this.role === 'ADMIN' ? this.class = 'icons-admin-div' : this.class = 'icons-div';
    this.dadosCompartilhadosSubscription = this.dadosCompartilhadosService.getCabecalhoAdminInfo().subscribe(
      (cabecalho) => {
        this.cabecalhoAdminInfo = cabecalho;
        this.titulo = cabecalho.titulo;
        if(cabecalho.titulo === '') {
          let cabecalho = localStorage.getItem('cabecalhoAdminInfo') as string;
          this.cabecalhoAdminInfo = JSON.parse(cabecalho) as Cabecalho;
        }
      }
    )
    this.dadosCompartilhadosSubscription = this.dadosCompartilhadosService.getCabecalhoMedicoInfo().subscribe(
      (cabecalho) => {
        this.cabecalhoMedicoInfo = cabecalho;
        this.titulo = cabecalho.titulo;
        if(this.cabecalhoMedicoInfo.titulo === '') {
          let cabecalho = localStorage.getItem('cabecalhoMedicoInfo') as string;
          this.cabecalhoMedicoInfo = JSON.parse(cabecalho) as Cabecalho;
        }
      }
    );
    this.dadosCompartilhadosSubscription = this.dadosCompartilhadosService.getCabecalhoAtendenteInfo().subscribe(
      (cabecalho) => {
        this.cabecalhoAtendenteInfo = cabecalho;
        this.titulo = cabecalho.titulo;
        if(this.cabecalhoAtendenteInfo.titulo === '') {
          let cabecalho = localStorage.getItem('cabecalhoAtendenteInfo') as string;
          this.cabecalhoAtendenteInfo = JSON.parse(cabecalho) as Cabecalho;
        }
      }
    );
  }

  ngOnDestroy() {
    this.dadosCompartilhadosSubscription.unsubscribe();
  }

  telaInicial() {
    this.route.navigate(['/home']);
  }

  btnAdminEvent() {
    this.route.navigate(['/' + this.cabecalhoAdminInfo.rota]);
  }

  btnMedicoEvent() {
    this.route.navigate(['/' + this.cabecalhoMedicoInfo.rota]);
  }

  btnAtendenteEvent() {
    this.route.navigate(['/' + this.cabecalhoAtendenteInfo.rota]);
  }

  btnSair() {
    this.auth.logout();
  }

}
