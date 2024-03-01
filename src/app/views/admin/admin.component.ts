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

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  providers: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit, OnDestroy {

  cabecalhoAdminInfo:Cabecalho = {
    titulo: 'Página administrativa',
    btn: 'shield_person',
    rota: 'admin'
  }
  cabecalhoMedicoInfo:Cabecalho = {
    titulo: 'Atendimentos',
    btn: 'stethoscope',
    rota: 'atendimento'
  }
  cabecalhoAtendenteInfo:Cabecalho = {
    titulo: 'Consultas',
    btn: 'splitscreen_add',
    rota: 'consulta'
  }
  formulario!:FormGroup;
  getUsuarios:GetUsuarios = new GetModeloUsuarios();
  paginaAtual = 0;
  totalPaginas = 0;
  alertSemUsuarios = false;
  authSubscription:Subscription = new Subscription();

  constructor(
    private router:Router,
    private formBuilder:FormBuilder,
    private authService:AutenticacaoService,
    private dadosCompartilhadosService:CompartilhamentoDadosService,
    public dialog:MatDialog,
  ) {}

  ngOnInit(): void {
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
        Validators.minLength(4)
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6)
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

}
