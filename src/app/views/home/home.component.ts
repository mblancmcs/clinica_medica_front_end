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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MensagemComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: []
})
export class HomeComponent implements OnInit {

  formulario!:FormGroup;
  mensagemValidacao:MensagemValidacao = {
    mensagem: '',
    class: ''
  }
  erroLogin = false;
  private formSubmitAttempt!: boolean;

  constructor(
    private authService: AutenticacaoService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      usuario: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/(.|\s)*\S(.|\s)*/) // Regex que não permite espaços vazios
      ])],
      senha: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
      ])]
    })
  }

  onSubmit() {
    if(!this.formulario.valid) {
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
    // this.formSubmitAttempt = true;
  }

}
