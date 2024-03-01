import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule, MatHint } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PacienteService } from '../../../service/paciente/paciente.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AtualizarPaciente, Paciente } from '../../../models/paciente-intefaces';
import { ModalPadraoComponent } from '../../modais-confirmacao/modal-padrao/modal-padrao.component';
import { ConfirmModal, PacienteModal } from '../../modais-confirmacao/interface-modais';
import { ModalPacienteConfirmadoComponent } from '../../modais-confirmacao/modal-paciente-confirmado/modal-paciente-confirmado.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-modal-paciente',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatHint,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  providers: [
    PacienteService,
    provideNgxMask()
  ],
  templateUrl: './modal-paciente.component.html',
  styleUrl: './modal-paciente.component.css'
})
export class ModalPacienteComponent implements OnInit {

  formulario!:FormGroup;

  constructor(
    private pacienteService: PacienteService,
    private formBuilder: FormBuilder,
    private dialog:MatDialog,
    public dialogRefPaciente:MatDialogRef<ModalPadraoComponent>,
    @Inject(MAT_DIALOG_DATA) public conteudo:Paciente
  ) {}

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      idModal: [this.conteudo.id, Validators.required],
      nomeModal: this.conteudo.nome,
      cpfModal: ['', Validators.required],
      dataNascimentoModal: this.conteudo.dataNascimento,
      telefoneModal: [this.conteudo.telefone.join(';'), Validators.compose([
        Validators.required,
        Validators.pattern(/(\(\d{2}\)\d{9,10};?)*/)
      ])]
    })
  }

  editar() {
    const paciente:AtualizarPaciente = {
      id:this.formulario.value.idModal,
      nome:this.formulario.value.nomeModal,
      cpf:this.formulario.value.cpfModal,
      dataNascimento:this.formulario.value.dataNascimentoModal,
      telefone:this.formulario.value.telefoneModal
    }
    if(this.formulario.valid) {
      this.pacienteService.atualizarPaciente(paciente);
      const pacienteAtualizado:PacienteModal = {
        titulo:'Edição',
        mensagem:'Edição realizada com sucesso!',
        confirmacao:'confirmado',
        paciente: paciente
      }
      this.dialog.open(ModalPacienteConfirmadoComponent, {
        data: pacienteAtualizado
      })
    }
  }

  deletar() {
    const confirmacaoDialog:ConfirmModal = {
      titulo:'Confirmação',
      mensagem:'Após excluir, não será mais possível reverter. Confirma a exclusão ?',
      class:'excluir'
    }
    this.dialogRefPaciente = this.dialog.open(ModalPadraoComponent, {
      data: confirmacaoDialog
    });
    this.dialogRefPaciente.afterClosed().subscribe(resultado => {
      if(resultado) {
        this.pacienteService.inativarPaciente(this.conteudo.id);
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
