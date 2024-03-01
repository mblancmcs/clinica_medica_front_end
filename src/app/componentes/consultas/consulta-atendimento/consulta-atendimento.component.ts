import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Atendimento, GetAtendimentos, modeloAtendimento, modeloGetAtendimentos } from '../../../models/atendimento-interfaces';
import { AtendimentoService } from '../../../service/atendimento/atendimento.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalAtendimentoComponent } from '../../atendimento/modal-atendimento/modal-atendimento.component';
import { EncurtarNomePipe } from '../../../pipes/encurtar-nome.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultas-por-cpf',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    EncurtarNomePipe
  ],
  providers: [],
  templateUrl: './consulta-atendimento.component.html',
  styleUrl: './consulta-atendimento.component.css'
})
export class ConsultasPorCpfComponent implements OnDestroy, OnChanges {

  atendimentosPorCpf:GetAtendimentos = new modeloGetAtendimentos();
  consultasSubscrition:Subscription = new Subscription();
  @Input() cpf = -1;
  paginaAtual = 0;
  totalPaginas = 0;
  alertSemAtendimentos = false;

  constructor(
    private atendimentoService:AtendimentoService,
    private route:Router,
    public dialog:MatDialog,
  ) { }

  ngOnChanges():void  {
    this.atendimentoService.listarAtendimentosPorCpf$(this.cpf, 0);
    this.consultasSubscrition = this.atendimentoService.atendimentosPorCpf$.subscribe(atendimentosPorCpf => {
      this.atendimentosPorCpf = atendimentosPorCpf;
      this.totalPaginas = atendimentosPorCpf.totalPages;
    })
  }

  ngOnDestroy(): void {
    this.consultasSubscrition.unsubscribe();
  }

  detalhesAtendimento(atendimento:Atendimento) {
    let dialogRef = this.dialog.open(ModalAtendimentoComponent, {
      width: '700px',
      data: atendimento
    }).afterClosed().subscribe(() => {
      this.atendimentoService.listarAtendimentosPorCpf$(this.cpf, this.paginaAtual);
    })

    /* dialogRef.afterClosed().subscribe(resultado  => {

    }) */
  }

  proximaPagina() {
    this.paginaAtual++;
    if(this.paginaAtual < this.totalPaginas) {
      this.atendimentoService.listarAtendimentosPorCpf$(this.cpf, this.paginaAtual);
      this.consultasSubscrition = this.atendimentoService.atendimentosPorCpf$.subscribe({
        next: (consultas) => {
          this.atendimentosPorCpf = consultas;
        },
        error: (erro) => {
          console.log('Erro: ' + erro);
        }
      })
      console.log(this.atendimentosPorCpf);
    } else {
      this.paginaAtual--;
      this.alertSemAtendimentos = true;
    }
  }

  paginaAnterior() {
    this.paginaAtual--;
    if(this.paginaAtual >= 0) {
      this.atendimentoService.listarAtendimentosPorCpf$(this.cpf, this.paginaAtual);
      this.consultasSubscrition = this.atendimentoService.atendimentosPorCpf$.subscribe({
        next: (atendimentos) => {
          this.atendimentosPorCpf = atendimentos;
        },
        error: (erro) => {
          console.log('Erro: ' + erro);
        }
      })
      console.log(this.atendimentosPorCpf);
    } else {
      this.paginaAtual++;
      this.alertSemAtendimentos = true;
    }
  }

  recarregarComponente() {
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([this.route.url]);
  }

}
