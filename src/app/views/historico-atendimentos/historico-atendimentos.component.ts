import { Component, OnDestroy, OnInit } from '@angular/core';
import { AtendimentoService } from '../../service/atendimento/atendimento.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Atendimento, GetAtendimentos, modeloAtendimento, modeloGetAtendimentos } from '../../models/atendimento-interfaces';
import { Subscription, catchError, debounceTime, distinctUntilChanged, filter, of, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalAtendimentoComponent } from '../../componentes/atendimento/modal-atendimento/modal-atendimento.component';
import { CompartilhamentoDadosService } from '../../service/compartilhamento-dados.service';
import { Cabecalho } from '../../componentes/cabecalho/cabecalho-interface';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { EncurtarNomePipe } from '../../pipes/encurtar-nome.pipe';
import { AutenticacaoService } from '../../service/autenticacao/autenticacao.service';
import { highlightedStateTrigger, listStateTrigger } from '../../animacoes';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-historico-atendimentos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    EncurtarNomePipe,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  providers: [
    provideNgxMask()
  ],
  animations: [
    listStateTrigger,
    highlightedStateTrigger
  ],
  templateUrl: './historico-atendimentos.component.html',
  styleUrl: './historico-atendimentos.component.css'
})
export class HistoricoAtendimentosComponent implements OnInit, OnDestroy {

  cabecalhoInfo:Cabecalho = {
    titulo: 'Histórico de atendimentos',
    tituloBtn: 'Atendimentos',
    btn: 'stethoscope',
    rota: 'atendimento'
  }
  campoCpf = new FormControl();
  getAtendimentos!:GetAtendimentos;
  getAtendimentosPorCpf:GetAtendimentos = new modeloGetAtendimentos();
  atendimentosSubscription:Subscription = new Subscription();
  paginaAtual = 0;
  totalPaginas = 0;
  alertSemAtendimentos = false;
  atendimentosPorCpf = false;
  indexAtendimento = -1;

  atendimentosPorCpf$ = this.campoCpf.valueChanges.pipe(
    filter(input => input !== ''),
    debounceTime(150),
    distinctUntilChanged(),
    switchMap(input => this.atendimentosService.listarAtendimentosPorCpf(input, this.paginaAtual)),
    tap(atendimentos => {
      this.getAtendimentosPorCpf = atendimentos;
      this.paginaAtual = 0;
      this.totalPaginas = atendimentos.totalPages;
    }),
    catchError(erro => {
      console.log(erro);
      this.paginaAtual = 0;
      this.totalPaginas = this.getAtendimentos.totalPages;
      return of(); // operador do rxjs que pode emitir um valor e "completar" o Observable
    })
  )

  constructor(
    private atendimentosService:AtendimentoService,
    private authService:AutenticacaoService,
    public dialog:MatDialog,
    private route:Router,
    public dadosCompartilhadosService:CompartilhamentoDadosService
  ) {}

  ngOnInit(): void {
    this.authService.protecaoPaginas();
    this.dadosCompartilhadosService.setCabecalhoMedicoInfo(this.cabecalhoInfo);
    this.listarAtendimentos();

    this.atendimentosSubscription = this.campoCpf.valueChanges.subscribe((input) => {
      if(input) {
        this.atendimentosPorCpf = true;
        this.totalPaginas = this.getAtendimentosPorCpf.totalPages;
      } else {
        this.atendimentosPorCpf = false;
        this.getAtendimentosPorCpf = new modeloGetAtendimentos();
        this.totalPaginas = this.getAtendimentos.totalPages;
      }
    });
  }

  ngOnDestroy(): void {
    this.atendimentosSubscription.unsubscribe();
  }

  detalhesAtendimento(atendimento:Atendimento) {
    let dialogRef = this.dialog.open(ModalAtendimentoComponent, {
      width: '700px',
      data: atendimento
    }).afterClosed().subscribe(() => {
      this.atendimentosPorCpf ? this.consultaCpf(this.paginaAtual) :  this.listarAtendimentos();
    })

    /* dialogRef.afterClosed().subscribe(resultado  => {

    }) */
  }

  consultaCpf(pagina = 0) {
    if(this.campoCpf.value) {
      this.atendimentosService.listarAtendimentosPorCpf(Number(this.campoCpf.value), pagina).subscribe({
        next: atendimentos => {
          if(this.getAtendimentosPorCpf.content !== null) {
            this.getAtendimentosPorCpf = atendimentos;
            this.totalPaginas = atendimentos.totalPages;
          }
        },
        error: () => {
          this.getAtendimentosPorCpf = new modeloGetAtendimentos();
        }
      })
    } else {
      this.atendimentosPorCpf = false;
      this.paginaAtual = 0;
      this.totalPaginas = this.getAtendimentos.totalPages;
    }
  }

  listarAtendimentos() {
    this.atendimentosService.listarAtendimentos(this.paginaAtual);
    this.atendimentosSubscription = this.atendimentosService.atendimentos$.subscribe({
      next: (atendimentos) => {
        this.getAtendimentos = atendimentos;
        this.totalPaginas = atendimentos.totalPages;
      },
      error: (erro) => {
        console.log('Erro: ' + erro);
      }
    })
  }

  mudarPagina(proxima:boolean) {
    proxima ? this.paginaAtual++ : this.paginaAtual--;
    if((proxima && this.paginaAtual < this.totalPaginas)
      || (!proxima && this.paginaAtual >= 0)) {
      if(this.atendimentosPorCpf) {
        this.consultaCpf(this.paginaAtual);
      } else {
        this.listarAtendimentos();
      }
    } else {
      proxima ? this.paginaAtual-- : this.paginaAtual++;
      this.alertSemAtendimentos = true;
    }
  }

}
