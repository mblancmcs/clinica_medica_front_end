import { Component, OnInit } from '@angular/core';
import { AutenticacaoService } from '../../service/autenticacao/autenticacao.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario-interface';
import { Autenticacao } from '../../models/autenticacao-interfaces';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: []
})
export class HomeComponent implements OnInit {

  formulario!:FormGroup;
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

  async onSubmit() {
    if(!this.formulario.valid) {
      return;
    }
    const login:Autenticacao = {
      login: this.formulario.value.usuario,
      password: this.formulario.value.senha
    };
    this.authService.login(login);
    this.formSubmitAttempt = true;
  }

}
