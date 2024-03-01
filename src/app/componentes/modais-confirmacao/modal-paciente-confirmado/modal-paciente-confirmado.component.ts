import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PacienteModal } from '../interface-modais';
import { MatIconModule } from '@angular/material/icon';
import { EncurtarNomePipe } from '../../../pipes/encurtar-nome.pipe';

@Component({
  selector: 'app-modal-paciente-confirmado',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    EncurtarNomePipe
  ],
  templateUrl: './modal-paciente-confirmado.component.html',
  styleUrl: './modal-paciente-confirmado.component.css'
})
export class ModalPacienteConfirmadoComponent {

  matIcon = 'check_circle';

  constructor(
    @Inject(MAT_DIALOG_DATA) public conteudo:PacienteModal
  ) { }

}
