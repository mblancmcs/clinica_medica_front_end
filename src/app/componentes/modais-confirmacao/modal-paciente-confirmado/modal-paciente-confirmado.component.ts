import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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
export class ModalPacienteConfirmadoComponent implements OnInit {

  matIcon = 'check_circle';
  textoCpf = ''

  constructor(
    @Inject(MAT_DIALOG_DATA) public conteudo:PacienteModal
  ) { }

  ngOnInit(): void {
    if(String(this.conteudo.paciente.cpf) === '') {
      this.textoCpf = 'Não alterado';
    } else {
      this.textoCpf = String(this.conteudo.paciente.cpf);
    }
  }

}
