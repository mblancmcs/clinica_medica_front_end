import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mensagem',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './mensagem.component.html',
  styleUrl: './mensagem.component.css'
})
export class MensagemComponent {

  @Input() mensagemValidacao:MensagemValidacao = {
    mensagem: '',
    class: ''
  };

}

export interface MensagemValidacao {
  mensagem:string,
  class:string
}
