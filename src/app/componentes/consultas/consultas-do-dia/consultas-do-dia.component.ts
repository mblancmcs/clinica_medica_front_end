import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ConsultaService } from '../../../service/consulta/consulta.service';
import { Consulta, GetConsulta } from '../../../models/consulta-interfaces';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { AtendimentoService } from '../../../service/atendimento/atendimento.service';
import { Atendimento, GetAtendimentos } from '../../../models/atendimento-interfaces';
import { EncurtarNomePipe } from '../../../pipes/encurtar-nome.pipe';
import { enabledButtonTrigger, highlightedStateTrigger, listStateTrigger, shakeTrigger } from '../../../animacoes';

@Component({
  selector: 'app-consultas-do-dia',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    EncurtarNomePipe
  ],
  providers: [],
  animations: [
    listStateTrigger,
    highlightedStateTrigger,
    enabledButtonTrigger
  ],
  templateUrl: './consultas-do-dia.component.html',
  styleUrl: './consultas-do-dia.component.css'
})
export class ConsultasDoDiaComponent implements OnInit, OnDestroy {

  atendimentosDoDia!:GetAtendimentos;
  atendimentoSubscription:Subscription = new Subscription();
  @Output() atendimentoEmitter = new EventEmitter<Atendimento>();
  indexAtendimento = -1;

  constructor(private atendimentoService:AtendimentoService) {}

  ngOnInit(): void {
    const data = new Date().toISOString().slice(0, 10);
    this.atendimentoService.listarAtendimentosPorData(data);
    this.atendimentoSubscription = this.atendimentoService.atendimentosPorData$.subscribe(atendimentos => {
      this.atendimentosDoDia = atendimentos;
    })
  }

  ngOnDestroy(): void {
    this.atendimentoSubscription.unsubscribe();
  }

  emitirAtendimento(atendimento:Atendimento):void {
    this.atendimentoEmitter.emit(atendimento);
  }

}
