import { AutenticacaoService } from './../../service/autenticacao/autenticacao.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GetModeloUsuarios, GetUsuarios, Usuario } from '../../models/usuario-interface';
import { CommonModule } from '@angular/common';
import { CompartilhamentoDadosService } from '../../service/compartilhamento-dados.service';
import { Cabecalho } from '../../componentes/cabecalho/cabecalho-interface';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ModalUsuariosComponent } from '../../componentes/admin/modal-usuarios/modal-usuarios.component';
import { UsuarioModal } from '../../componentes/modais-confirmacao/interface-modais';
import { ModalUsuarioConfirmadoComponent } from '../../componentes/modais-confirmacao/modal-usuario-confirmado/modal-usuario-confirmado.component';
import { MensagemComponent, MensagemValidacao } from '../../componentes/mensagem/mensagem.component';
import { CustomValidators } from '../../CustomValidators';
import { enabledButtonTrigger, highlightedStateTrigger, listStateTrigger, shakeTrigger } from '../../animacoes';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MensagemComponent
  ],
  providers: [],
  animations: [
    listStateTrigger,
    highlightedStateTrigger,
    shakeTrigger,
    enabledButtonTrigger
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit, OnDestroy {

  cabecalhoAdminInfo:Cabecalho = {
    titulo: 'Painel administrativo',
    tituloBtn: 'Painel administrativo',
    btn: 'shield_person',
    rota: 'admin'
  }
  cabecalhoMedicoInfo:Cabecalho = {
    titulo: 'Atendimentos',
    tituloBtn: 'Atendimentos',
    btn: 'stethoscope',
    rota: 'atendimento'
  }
  cabecalhoAtendenteInfo:Cabecalho = {
    titulo: 'Consultas',
    tituloBtn: 'Consultas',
    btn: 'splitscreen_add',
    rota: 'consulta'
  }
  indexUser = -1;
  formulario!:FormGroup;
  getUsuarios:GetUsuarios = new GetModeloUsuarios();
  paginaAtual = 0;
  totalPaginas = 0;
  alertSemUsuarios = false;
  authSubscription:Subscription = new Subscription();
  erroLogin = false;
  erroSenha = false;
  msgValidacaoLogin:MensagemValidacao = {
    mensagem: '',
    class: 'erro'
  };
  msgValidacaoSenha:MensagemValidacao = {
    mensagem: '',
    class: 'erro'
  };

  constructor(
    private router:Router,
    private formBuilder:FormBuilder,
    private authService:AutenticacaoService,
    private dadosCompartilhadosService:CompartilhamentoDadosService,
    public dialog:MatDialog,
  ) {}

  ngOnInit(): void {
    this.authService.protecaoPaginas();
    this.dadosCompartilhadosService.setCabecalhoMedicoInfo(this.cabecalhoMedicoInfo);
    this.dadosCompartilhadosService.setCabecalhoAtendenteInfo(this.cabecalhoAtendenteInfo);
    this.dadosCompartilhadosService.setCabecalhoAdminInfo(this.cabecalhoAdminInfo);

    this.authSubscription = this.authService.listar(0).subscribe((usuarios) => {
      this.getUsuarios = usuarios;
      this.totalPaginas = usuarios.totalPages;
    })

    this.formulario = this.formBuilder.group({
      login: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        CustomValidators.validarSenha()
      ])],
      role: ['', Validators.required]
    })
    this.listarUsuarios(this.paginaAtual);
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  detalhesUsuario(usuario:Usuario) {
    let dialogRef = this.dialog.open(ModalUsuariosComponent, {
      width: '700px',
      data: usuario
    }).afterClosed().subscribe(() => {
      this.listarUsuarios(this.paginaAtual);
    })
    /* dialogRef.afterClosed().subscribe(resultado  => {

    }) */
  }

  listarUsuarios(pagina = 0) {
    this.authSubscription = this.authService.listar(pagina).subscribe(usuarios => {
      this.getUsuarios = usuarios;
      console.log(usuarios);
    })
  }

  registrar() {
    this.authSubscription = this.authService.registrar(this.formulario.value).subscribe(() => {
      const usuario:Usuario = {
        login:this.formulario.value.login,
        role:this.formulario.value.role
      }
      const usuarioRegistrado:UsuarioModal = {
        titulo:'Registro de usuário',
        mensagem:'Usuário registrado com sucesso!',
        confirmacao:'confirmado',
        usuario: usuario
      };
      this.dialog.open(ModalUsuarioConfirmadoComponent, {
        data: usuarioRegistrado
      })
      this.listarUsuarios(this.paginaAtual);
    })
  }

  proximaPagina() {
    this.paginaAtual++;
    if(this.paginaAtual < this.totalPaginas) {
      this.authSubscription = this.authService.listar(this.paginaAtual).subscribe({
        next: (atendimentos) => {
          this.getUsuarios = atendimentos;
        },
        error: (erro) => {
          console.log('Erro: ' + erro);
        }
      })
      console.log(this.getUsuarios);
    } else {
      this.paginaAtual--;
      this.alertSemUsuarios = true;
    }
  }

  paginaAnterior() {
    this.paginaAtual--;
    if(this.paginaAtual >= 0) {
      this.authSubscription = this.authService.listar(this.paginaAtual).subscribe({
        next: (atendimentos) => {
          this.getUsuarios = atendimentos;
        },
        error: (erro) => {
          console.log('Erro: ' + erro);
        }
      })
      console.log(this.getUsuarios);
    } else {
      this.paginaAtual++;
      this.alertSemUsuarios = true;
    }
  }

  validarLogin() {
    let inputLogin = this.formulario.value.login;
    if(inputLogin.includes(' ')) {
      this.erroLogin = true;
      this.msgValidacaoLogin.mensagem = 'Não é permitido espaços em branco';
    } else if(inputLogin.length < 8) {
      this.erroLogin = true;
      this.msgValidacaoLogin.mensagem = 'Mínimo de 8 caracteres';
    } else {
      this.erroLogin = false;
    }
  }

  validarSenha() {
    let msgValidacao = "Necessário: 8 caracteres, letra maiúscula, letra minúscula,"
                        + " número, caracter especial";
    let inputSenha = this.formulario.value.password;

    const letras = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z";
    const numeros = "0,1,2,3,4,5,6,7,8,9";
    const numerosArray = numeros.split(',');
    const letrasMinusculas = letras.split(',');
    const letrasMaiusculas = letras.toUpperCase().split(',');
    const caracteresEspeciais = [
      '!', '@', '#', '$', '%', '^', '&', '*', '(', ')',
      '[', ']', '{', '}', '<', '>', '|', '\\', '/',
      ':', ';', ',', '.', '?', '-', '_', '+', '=', '~'
    ];
    if(inputSenha.length >= 8) {
      msgValidacao = msgValidacao.replace(' 8 caracteres', '');
    }
    letrasMaiusculas.forEach(i => {
      if(inputSenha.includes(i)) {
        msgValidacao = msgValidacao.replace(', letra maiúscula', '');
      }
    });
    letrasMinusculas.forEach(i => {
      if(inputSenha.includes(i)) {
        msgValidacao = msgValidacao.replace(', letra minúscula', '');
      }
    });
    numerosArray.forEach(i => {
      if(inputSenha.includes(i)) {
        msgValidacao = msgValidacao.replace(', número', '');
      }
    });
    caracteresEspeciais.forEach(i => {
      if(inputSenha.includes(i)) {
        msgValidacao = msgValidacao.replace(', caracter especial', '');
      }
    });
    if(inputSenha.includes(' ')) {
      msgValidacao = 'Não é permitido espaços em branco';
    }
    console.log(msgValidacao);
    if(msgValidacao !== 'Necessário:') {
      this.erroSenha = true;
      this.msgValidacaoSenha.mensagem = msgValidacao;
    } else {
      this.erroSenha = false;
      this.msgValidacaoSenha.mensagem = '';
    }
  }

}
