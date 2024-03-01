import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AtendimentoModal } from '../interface-modais';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modal-atendimento-confirmado',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './modal-atendimento-confirmado.component.html',
  styleUrl: './modal-atendimento-confirmado.component.css'
})
export class ModalAtendimentoConfirmadoComponent {

  matIcon = 'check_circle';

  constructor(
    @Inject(MAT_DIALOG_DATA) public conteudo:AtendimentoModal
  ) {}

}
