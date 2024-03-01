import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ConsultaService } from '../../../service/consulta/consulta.service';
import { AtualizarConsulta, Consulta } from '../../../models/consulta-interfaces';
import { ModalConsultaConfirmadaComponent } from '../../modais-confirmacao/modal-consulta-confirmada/modal-consulta-confirmada.component';
import { ConfirmModal, ConsultaModal } from '../../modais-confirmacao/interface-modais';
import { ModalPadraoComponent } from '../../modais-confirmacao/modal-padrao/modal-padrao.component';

@Component({
  selector: 'app-modal-consulta',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  providers: [
    ConsultaService
  ],
  templateUrl: './modal-consulta.component.html',
  styleUrl: './modal-consulta.component.css'
})
export class ModalConsultaComponent implements OnInit {

  formulario!:FormGroup;

  constructor(
    private consultaService:ConsultaService,
    private formBuilder:FormBuilder,
    private dialog:MatDialog,
    public dialogRefConsulta:MatDialogRef<ModalPadraoComponent>,
    @Inject(MAT_DIALOG_DATA) public conteudo: Consulta,
  ) {}

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      idModal: [this.conteudo.id, Validators.required],
      dataModal: {value: this.conteudo.data, disabled:true},
      senhaModal: {value:this.conteudo.senha, disabled:true},
      planoParticularModal: this.conteudo.planoParticular,
      motivoModal: this.conteudo.motivo
    })
  }

  editar() {
    const consulta:AtualizarConsulta = {
      id: this.conteudo.id,
      data: this.conteudo.data,
      senha: this.formulario.value.senhaModal,
      planoParticular: this.formulario.value.planoParticularModal,
      motivo: this.formulario.value.motivoModal
    };
    if(this.formulario.valid) {
      this.consultaService.atualizarConsulta(consulta);
      const consultaAtualizada:ConsultaModal = {
        titulo:'Edição',
        mensagem:'Edição realizada com sucesso!',
        confirmacao:'confirmado',
        consulta: consulta
      }
      this.dialog.open(ModalConsultaConfirmadaComponent, {
        data: consultaAtualizada
      })
    }
  }

  deletar() {
    const confirmacaoDialog:ConfirmModal = {
      titulo:'Exclusão',
      mensagem:'Após excluir, não será mais possível reverter. Confirma a exclusão ?',
      class:'excluir'
    }
    this.dialogRefConsulta = this.dialog.open(ModalPadraoComponent, {
      data: confirmacaoDialog
    });
    this.dialogRefConsulta.afterClosed().subscribe(resultado => {
      if(resultado) {
        this.consultaService.inativarConsulta(this.conteudo.id);
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
