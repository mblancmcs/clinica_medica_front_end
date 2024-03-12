import { AtendimentosDoDiaComponent } from '../../componentes/atendimento/atendimentos-do-dia/atendimentos-do-dia.component';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AtendimentoService } from '../../service/atendimento/atendimento.service';
import { Atendimento, AtualizarAtendimento } from '../../models/atendimento-interfaces';
import { ConsultaService } from '../../service/consulta/consulta.service';
import { Consulta, GetConsulta } from '../../models/consulta-interfaces';
import { CommonModule } from '@angular/common';
import { AtendimentosPorCpfComponent } from '../../componentes/atendimento/atendimentos-cpf/atendimentos-cpf.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CompartilhamentoDadosService } from '../../service/compartilhamento-dados.service';
import { Cabecalho } from '../../componentes/cabecalho/cabecalho-interface';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AtendimentoModal } from '../../componentes/modais-confirmacao/interface-modais';
import { ModalAtendimentoConfirmadoComponent } from '../../componentes/modais-confirmacao/modal-atendimento-confirmado/modal-atendimento-confirmado.component';
import { AutenticacaoService } from '../../service/autenticacao/autenticacao.service';
import { enabledButtonTrigger } from '../../animacoes';

@Component({
  selector: 'app-atendimento-medico',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AtendimentosDoDiaComponent,
    AtendimentosPorCpfComponent,
    MatIconModule
  ],
  providers: [],
  animations: [
    enabledButtonTrigger
  ],
  templateUrl: './atendimento-medico.component.html',
  styleUrl: './atendimento-medico.component.css'
})
export class AtendimentoMedicoComponent implements OnInit {

  cabecalhoInfo:Cabecalho = {
    titulo: 'Atendimentos',
    tituloBtn: 'Histórico de atendimentos',
    btn: 'manage_search',
    rota: 'historicoAtendimentos'
  }
  formulario!:FormGroup;
  cpfAConsultar = -1;
  idAtendimento = -1;
  btnNome = 'forms_add_on';

  constructor(
    private formBuilder:FormBuilder,
    private router:Router,
    private atendimentoService:AtendimentoService,
    private authService: AutenticacaoService,
    private dadosCompartilhadosService:CompartilhamentoDadosService,
    private dialog:MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.protecaoPaginas();
    this.dadosCompartilhadosService.setCabecalhoMedicoInfo(this.cabecalhoInfo);

    this.formulario = this.formBuilder.group({
      id: [{value: -1, disabled:true}, Validators.required],
      diagnostico:[{value: '', disabled:true}, Validators.required],
      receitaRemedios:[{value:'', disabled:true}],
      solicitacaoRetorno:[{value:'', disabled:true}],
      complemento: [{value: '', disabled:true}]
    })
  }

  onSubmit(): void {
    if(this.formulario.valid) {
      const atualizarAtendimento: AtualizarAtendimento = {
        id: this.formulario.value.id,
        diagnostico: this.formulario.value.diagnostico,
        receitaRemedios: this.formulario.value.receitaRemedios,
        solicitacaoRetorno: this.formulario.value.solicitacaoRetorno,
        complemento: this.formulario.value.complemento
      }
      this.atendimentoService.atualizarAtendimento(atualizarAtendimento, true, true);
      const atendimentoRealizado:AtendimentoModal = {
        titulo:'Conclusão de atendimento',
        mensagem:'Atendimento concluído com sucesso!',
        confirmacao:'confirmado',
        atendimento: atualizarAtendimento
      };
      this.dialog.open(ModalAtendimentoConfirmadoComponent, {
        data: atendimentoRealizado
      })
    }
  }

  atendimentoRecebido($event:Atendimento) {
    this.cpfAConsultar = $event.consulta.dadosPaciente.cpf;
    $event.diagnostico !== null ? this.btnNome = 'edit_note' : this.btnNome = 'forms_add_on';
    if($event.id !== -1) {
      this.resetarFormulario();

      this.formulario.get('id')?.enable();
      this.formulario.get('diagnostico')?.enable();
      this.formulario.get('receitaRemedios')?.enable();
      this.formulario.get('solicitacaoRetorno')?.enable();
      this.formulario.get('complemento')?.enable();

      this.formulario.patchValue({
        id: $event.id,
        diagnostico: $event.diagnostico,
        receitaRemedios: $event.receitaRemedios,
        solicitacaoRetorno: $event.solicitacaoRetorno,
        complemento: $event.complemento
      });

    }
  }

  resetarFormulario():void {
    this.formulario.reset({
      id: -1,
      diagnostico: '',
      receitaRemedios: '',
      solicitacaoRetorno: '',
      complemento: ''
    })
  }

}

