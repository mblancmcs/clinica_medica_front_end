import { Component, OnInit } from '@angular/core';
import { AutenticacaoService } from '../../service/autenticacao/autenticacao.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario-interface';
import { Autenticacao } from '../../models/autenticacao-interfaces';
import { Subscription } from 'rxjs';
import { MensagemComponent, MensagemValidacao } from '../../componentes/mensagem/mensagem.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { invalidShakeTrigger } from '../../animacoes';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MensagemComponent,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [],
  animations: [
    invalidShakeTrigger
  ]
})
export class HomeComponent implements OnInit {

  formulario!:FormGroup;
  mensagemValidacao:MensagemValidacao = {
    mensagem: '',
    class: ''
  }
  erroLogin = false;
  camposEmBranco = '';
  private formSubmitAttempt!: boolean;

  constructor(
    private authService: AutenticacaoService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      usuario: ['', Validators.compose([
        Validators.required
      ])],
      senha: ['', Validators.compose([
        Validators.required
      ])]
    })
  }

  onSubmit() {
    if(!this.formulario.valid) {
      this.camposEmBranco = "invalido";
      setTimeout(() => {
        this.camposEmBranco = "";
      }, 500);
      return;
    }
    const login:Autenticacao = {
      login: this.formulario.value.usuario,
      password: this.formulario.value.senha
    };
    this.authService.login(login);
    this.authService.isLoggedIn.subscribe({
      next: (resultado) => {
        if(!resultado) {
          this.mensagemValidacao = {
            mensagem: 'Credenciais inválidas',
            class: 'erro'
          }
          this.erroLogin = true;
        } else {
          this.mensagemValidacao = {
            mensagem: '',
            class: ''
          }
          this.erroLogin = false;
        }
      },
      error: (erro) => {
        console.error(erro);
      }
    })
  }

}
