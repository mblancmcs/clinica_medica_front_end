import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuarioModal } from '../interface-modais';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modal-usuario-confirmado',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './modal-usuario-confirmado.component.html',
  styleUrl: './modal-usuario-confirmado.component.css'
})
export class ModalUsuarioConfirmadoComponent implements OnInit {

  textoSenha = "Atualizada";
  matIcon = 'check_circle'

  constructor(
    @Inject(MAT_DIALOG_DATA) public conteudo:UsuarioModal
  ) {}

  ngOnInit(): void {
    this.conteudo.confirmacao === "confirmado" ? this.textoSenha = "Criada" : this.textoSenha = "Atualizada";
    if(this.conteudo.confirmacao === "confirmadoAtualizar" && this.conteudo.usuario.password === '') {
      this.textoSenha = "Não modificada";
    } else if(this.conteudo.confirmacao === "confirmadoAtualizar" && this.conteudo.usuario.password !== null) {
      this.textoSenha = "Atualizada"
    }
  }

}
