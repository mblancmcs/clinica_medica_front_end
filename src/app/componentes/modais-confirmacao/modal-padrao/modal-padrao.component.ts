import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmModal } from '../interface-modais';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modal-padrao',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './modal-padrao.component.html',
  styleUrl: './modal-padrao.component.css'
})
export class ModalPadraoComponent implements OnInit {

  classBtns = ['erroOpcao', 'excluir', 'cadastrarAtualizar'];
  iconWarning = ['erro', 'erroOpcao', 'excluir', 'cadastrarAtualizar'];
  matIcon = 'check_circle';
  btns = false;

  constructor(
    public dialogRef:MatDialogRef<ModalPadraoComponent>,
    @Inject(MAT_DIALOG_DATA) public conteudo:ConfirmModal
  ) { }

  ngOnInit(): void {
    this.classBtns.forEach(i => {
      if(this.conteudo.class === i) {
        this.btns = true;
      }
    })
    this.iconWarning.forEach(i => {
      if(this.conteudo.class === i) {
        this.matIcon = 'warning';
      }
    })
  }

}
