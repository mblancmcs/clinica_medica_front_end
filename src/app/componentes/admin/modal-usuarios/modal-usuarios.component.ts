import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AutenticacaoService } from '../../../service/autenticacao/autenticacao.service';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Usuario } from '../../../models/usuario-interface';
import { MatInputModule } from '@angular/material/input';
import { ConfirmModal, UsuarioModal } from '../../modais-confirmacao/interface-modais';
import { ModalUsuarioConfirmadoComponent } from '../../modais-confirmacao/modal-usuario-confirmado/modal-usuario-confirmado.component';
import { ModalPadraoComponent } from '../../modais-confirmacao/modal-padrao/modal-padrao.component';

@Component({
  selector: 'app-modal-usuarios',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule
  ],
  providers: [
    AutenticacaoService
  ],
  templateUrl: './modal-usuarios.component.html',
  styleUrl: './modal-usuarios.component.css'
})
export class ModalUsuariosComponent implements OnInit {

  formulario!:FormGroup

  constructor(
    private usuarioService:AutenticacaoService,
    private formBuilder:FormBuilder,
    public dialog:MatDialog,
    public dialogRefUsuario:MatDialogRef<ModalPadraoComponent>,
    @Inject(MAT_DIALOG_DATA) public conteudo: Usuario,
  ) {}

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      loginModal:{value: this.conteudo.login, disabled:true},
      senhaModal:'',
      perfilModal:[this.conteudo.role, Validators.required]
    })
  }

  editar() {
    const atualizarUsuario:Usuario = {
      login:this.conteudo.login,
      password:this.formulario.value.senhaModal,
      role:this.formulario.value.perfilModal
    }
    this.usuarioService.atualizar(atualizarUsuario).subscribe({
      next: () => {
        const usuarioAtualizado:UsuarioModal = {
          titulo:'Edição',
          mensagem:'Edição realizada com sucesso!',
          confirmacao:'confirmadoAtualizar',
          usuario: atualizarUsuario
        }
        this.dialog.open(ModalUsuarioConfirmadoComponent, {
          data: usuarioAtualizado
        })
      },
      error: (erro) => {
        console.log(erro);
      }
    })
  }

  deletar() {
    const confirmacaoDialog:ConfirmModal = {
      titulo:'Exclusão',
      mensagem:'Após excluir, não será mais possível reverter. Confirma a exclusão ?',
      class:'excluir'
    };
    this.dialogRefUsuario = this.dialog.open(ModalPadraoComponent, {
      data: confirmacaoDialog
    });
    this.dialogRefUsuario.afterClosed().subscribe(resultado => {
      if(resultado) {
        this.usuarioService.deletar(this.conteudo).subscribe({
          next: () => {
            const exclusaoRealizada:ConfirmModal = {
              titulo:'Exclusão',
              mensagem:'Exclusão realizada com sucesso!',
              class:'confirmadoExcluir'
            }
            this.dialog.open(ModalPadraoComponent, {
              data: exclusaoRealizada
            })
          },
          error: () => {
            console.log('Erro na exclusão');
          }
        })
      }
    })
  }

}
