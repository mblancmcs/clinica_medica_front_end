import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AtendimentoService } from '../../../service/atendimento/atendimento.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Atendimento, AtualizarAtendimento } from '../../../models/atendimento-interfaces';
import { MatIconModule } from '@angular/material/icon';
import { ModalPadraoComponent } from '../../modais-confirmacao/modal-padrao/modal-padrao.component';
import { AtendimentoModal, ConfirmModal } from '../../modais-confirmacao/interface-modais';
import { ModalAtendimentoConfirmadoComponent } from '../../modais-confirmacao/modal-atendimento-confirmado/modal-atendimento-confirmado.component';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-modal-atendimento',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  providers: [
    AtendimentoService
  ],
  templateUrl: './modal-atendimento.component.html',
  styleUrl: './modal-atendimento.component.css'
})
export class ModalAtendimentoComponent implements OnInit {

  formulario!:FormGroup;

  constructor(
    public dialogRef:MatDialogRef<ModalPadraoComponent>,
    public dialogRefAtendimento:MatDialogRef<ModalAtendimentoConfirmadoComponent>,
    public dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public conteudo: Atendimento,
    private atendimentoService: AtendimentoService,
    private formBuilder:FormBuilder
  ) { }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      idModal: [this.conteudo.id, Validators.required],
      dataConsultaModal: [{value: formatDate(this.conteudo.consulta.data, 'dd/MM/yyyy', 'en'), disabled: true}, Validators.required],
      nomeModal: [{value:this.conteudo.consulta.dadosPaciente.nome, disabled: true}, Validators.required],
      motivoModal: [{value:this.conteudo.consulta.motivo, disabled: true}, Validators.required],
      diagnosticoModal: [this.conteudo.diagnostico, Validators.required],
      receitaRemediosModal: this.conteudo.receitaRemedios,
      solicitacaoRetornoModal: this.conteudo.solicitacaoRetorno,
      complementoModal: this.conteudo.complemento
    })
  }

  editar() {
    const atualizarAtendimento:AtualizarAtendimento = {
      id: this.formulario.value.idModal,
      diagnostico: this.formulario.value.diagnosticoModal,
      receitaRemedios: this.formulario.value.receitaRemediosModal,
      solicitacaoRetorno: this.formulario.value.solicitacaoRetornoModal,
      complemento: this.formulario.value.complementoModal
    }
    if(this.formulario.valid) {
      this.atendimentoService.atualizarAtendimento(atualizarAtendimento);
      const atendimentoAtualizado:AtendimentoModal = {
        titulo:'Edição',
        mensagem:'Edição realizada com sucesso!',
        confirmacao:'confirmado',
        atendimento: atualizarAtendimento
      }
      this.dialog.open(ModalAtendimentoConfirmadoComponent, {
        data: atendimentoAtualizado
      });
    }
  }

  deletar() {
    const confirmacaoDialog:ConfirmModal = {
      titulo:'Exclusão',
      mensagem:'Após excluir, não será mais possível reverter. Confirma a exclusão ?',
      class:'excluir',
    }
    this.dialogRef = this.dialog.open(ModalPadraoComponent, {
      data: confirmacaoDialog
    });
    this.dialogRef.afterClosed().subscribe(resultado => {
      if(resultado) {
        this.atendimentoService.inativarAtendimento(this.conteudo.id);
        const exclusaoRealizada:ConfirmModal = {
          titulo:'Exclusão',
          mensagem:'Exclusão realizada com sucesso!',
          class:'confirmadoExcluir'
        }
        this.dialog.open(ModalPadraoComponent, {
          data: exclusaoRealizada
        })
      }
    })
  }

}
