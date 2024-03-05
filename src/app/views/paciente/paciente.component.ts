import { AfterContentChecked, ChangeDetectorRef, Component, DoCheck, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CompartilhamentoDadosService } from '../../service/compartilhamento-dados.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CadastroPaciente } from '../../models/paciente-intefaces';
import { PacienteService } from '../../service/paciente/paciente.service';
import { TabelaPacientesComponent } from '../../componentes/pacientes/tabela-pacientes/tabela-pacientes.component';
import { Cabecalho } from '../../componentes/cabecalho/cabecalho-interface';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmModal, PacienteModal } from '../../componentes/modais-confirmacao/interface-modais';
import { ModalPadraoComponent } from '../../componentes/modais-confirmacao/modal-padrao/modal-padrao.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalPacienteConfirmadoComponent } from '../../componentes/modais-confirmacao/modal-paciente-confirmado/modal-paciente-confirmado.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { AutenticacaoService } from '../../service/autenticacao/autenticacao.service';
import { CustomValidators } from '../../CustomValidators';
import { MensagemComponent } from '../../componentes/mensagem/mensagem.component';
import { CommonModule } from '@angular/common';
import { ValidaCpf } from '../../util/ValidaCpf';
import { GerarCpf } from '../../util/GerarCpf';
import { enabledButtonTrigger, shakeTrigger } from '../../animacoes';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [
    CommonModule,
    MensagemComponent,
    TabelaPacientesComponent,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  providers: [
    provideNgxMask()
  ],
  animations: [
    enabledButtonTrigger,
    shakeTrigger
  ],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.css'
})
export class PacienteComponent implements OnInit, OnDestroy {

  cabecalhoInfo:Cabecalho = {
    titulo: 'Pacientes',
    btn: 'splitscreen_add',
    rota: 'consulta'
  }
  public cpfRecebido = '';
  public formulario!:FormGroup;
  public disabled = true;
  public cpfInvalido = false;
  public cpfState = '';
  private pacienteSubscription:Subscription = new Subscription();
  dataAtual = new Date().toISOString().slice(0, 10);

  constructor(
    private dadosCompartilhados: CompartilhamentoDadosService,
    private authService:AutenticacaoService,
    private formBuilder:FormBuilder,
    private route:Router,
    private pacienteService:PacienteService,
    private dialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.authService.protecaoPaginas();
    this.dadosCompartilhados.setCabecalhoAtendenteInfo(this.cabecalhoInfo);
    this.pacienteService.getMensagemErro().subscribe({
      next: (mensagemErro) => {
        const confirmacaoDialog:ConfirmModal = {
          titulo:'Erro',
          mensagem:mensagemErro,
          class:'erro'
        }
        this.dialog.open(ModalPadraoComponent, {
          data: confirmacaoDialog
        })
      },
      error: (erro) => {
        console.log(erro);
      }
    })

    this.pacienteSubscription = this.dadosCompartilhados.getCpf().subscribe(dados => {
      if(dados != '') {
        this.cpfRecebido = dados;
      }
    })

    this.formulario = this.formBuilder.group({
      nome: ['', Validators.required],
      cpf: [this.cpfRecebido, Validators.compose([
        CustomValidators.isValidCpf(),
        Validators.required,
        Validators.pattern(/(.|\s)*\S(.|\s)*/)
      ])],
      dataNascimento: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/(.|\s)*\S(.|\s)*/)
      ])],
      telefone: ['', Validators.compose([
        Validators.required,
        Validators.minLength(10)
      ])]
    });
  }

  ngOnDestroy(): void {
    this.pacienteSubscription.unsubscribe();
  }

  onSubmit() {
    if(this.formulario.valid) {
      const paciente:CadastroPaciente = {
        nome: this.formulario.value.nome,
        cpf: this.formulario.value.cpf,
        dataNascimento: this.formulario.value.dataNascimento,
        telefone: this.formulario.value.telefone
      };
      this.pacienteService.cadastrarPaciente(paciente);
      this.pacienteService.getDadoCompartilhado().subscribe({
        next: (paciente) => {
          if(paciente) {
            const telefonesString = paciente.telefone.join(";")
            const pacienteCadastrada:PacienteModal = {
              titulo:'Cadastro',
              mensagem:'Paciente cadastrado com sucesso!',
              confirmacao:'confirmado',
              paciente: {
                id:paciente.id,
                nome:paciente.nome,
                cpf:paciente.cpf,
                dataNascimento:paciente.dataNascimento,
                telefone:telefonesString
              }
            }
            this.dialog.open(ModalPacienteConfirmadoComponent, {
              data: pacienteCadastrada
            })
          }
        },
        error: (erro) => {
          console.log(erro);
        }
      })
    }
  }

  validarCpf() {
    const cpfInput = this.formulario.value.cpf;
    const cpfValidado = ValidaCpf.validar(cpfInput);
    if(cpfInput.length < 11 || cpfValidado?.cpfNotValid === true) {
      this.cpfInvalido = true;
      this.cpfState = '';
      this.cpfState = 'invalido'
    } else {
      this.cpfInvalido = false;
    }
  }

  gerarCpf() {
    this.formulario.patchValue({cpf: GerarCpf.generate()});
    this.validarCpf();
  }

}
