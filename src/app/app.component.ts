import { ConsultaComponent } from './views/consulta/consulta.component';
import { JwtService } from './service/autenticacao/jwt.service';
import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, provideRouter } from '@angular/router';
import { CabecalhoComponent } from './componentes/cabecalho/cabecalho.component';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { AuthInterceptorService } from './service/autenticacao/auth-interceptor.service';
import { AutenticacaoService } from './service/autenticacao/autenticacao.service';
import { AuthGuardService } from './service/autenticacao/auth-guard.service';
import { PacienteComponent } from './views/paciente/paciente.component';
import { CompartilhamentoDadosService } from './service/compartilhamento-dados.service';
import { NgModel } from '@angular/forms';
import { ConsultaService } from './service/consulta/consulta.service';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AtendimentoService } from './service/atendimento/atendimento.service';
import { ModalAtendimentoComponent } from './componentes/atendimento/modal-atendimento/modal-atendimento.component';
import { PacienteService } from './service/paciente/paciente.service';
import { Cabecalho } from './componentes/cabecalho/cabecalho-interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    CabecalhoComponent,
    HttpClientModule,
    ConsultaComponent,
    PacienteComponent,
    MatDialogModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    MatDialogConfig,
    AutenticacaoService,
    ConsultaService,
    PacienteService,
    AtendimentoService,
    CompartilhamentoDadosService
  ]
})
export class AppComponent implements OnInit, AfterContentChecked {
  title = 'clinica_medica';
  userRole!:string;
  authPath = ['consulta', 'paciente', 'atendimento', 'historicoAtendimentos'];

  constructor(
    public rota:Router,
    private JwtService: JwtService,
    private cd:ChangeDetectorRef
  ) {
    const token = localStorage.getItem('token') === null ? '' : localStorage.getItem('token') as string;
    this.userRole = this.JwtService.getClaim(token, 'role');
    console.log('user role: ', this.userRole);
  }

  ngOnInit() {
    /* if(this.userRole === 'ATENDENTE') {
      this.authPath = ['consulta', 'paciente'];
    } else if(this.userRole === 'MEDICO') {
      this.authPath = ['historicoAtendimentos', 'atendimento'];
    }

    if(!this.authPath.includes(this.rota.url.replace('/', ''))) {
      this.rota.navigate(['/home']);
    } */
  }

  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }

}
