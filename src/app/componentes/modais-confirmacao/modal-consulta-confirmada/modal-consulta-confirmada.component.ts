import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConsultaModal } from '../interface-modais';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modal-consulta-confirmada',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './modal-consulta-confirmada.component.html',
  styleUrl: './modal-consulta-confirmada.component.css'
})
export class ModalConsultaConfirmadaComponent {

  matIcon = 'check_circle';

  constructor(
    @Inject(MAT_DIALOG_DATA) public conteudo:ConsultaModal
  ) {}

}
