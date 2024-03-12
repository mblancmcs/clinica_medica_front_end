import { AfterContentChecked, AfterViewChecked, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConsultaService } from '../../service/consulta/consulta.service';
import { Consulta, GetConsulta, MarcarConsulta, getModeloConsulta } from '../../models/consulta-interfaces';
import { PacienteService } from '../../service/paciente/paciente.service';
import { Router } from '@angular/router';
import { CompartilhamentoDadosService } from '../../service/compartilhamento-dados.service';
import { ConsultasTotaisComponent } from '../../componentes/consultas/consultas-totais/consultas-totais.component';
import { Observable, Subscription, catchError, of } from 'rxjs';
import { Cabecalho } from '../../componentes/cabecalho/cabecalho-interface';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmModal, ConsultaModal } from '../../componentes/modais-confirmacao/interface-modais';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ModalPadraoComponent } from '../../componentes/modais-confirmacao/modal-padrao/modal-padrao.component';
import { ModalConsultaConfirmadaComponent } from '../../componentes/modais-confirmacao/modal-consulta-confirmada/modal-consulta-confirmada.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { AutenticacaoService } from '../../service/autenticacao/autenticacao.service';
import { ValidaCpf } from '../../util/ValidaCpf';
import { MensagemComponent } from '../../componentes/mensagem/mensagem.component';
import { CommonModule } from '@angular/common';
import { CustomValidators } from '../../CustomValidators';
import { GerarCpf } from '../../util/GerarCpf';
import { enabledButtonTrigger, shakeTrigger } from '../../animacoes';

@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConsultasTotaisComponent,
    MatIconModule,
    MensagemComponent,
    NgxMaskDirective,
    NgxMaskPipe,
    MatTooltipModule
  ],
  providers: [
    provideNgxMask()
  ],
  animations: [
    enabledButtonTrigger,
    shakeTrigger
  ],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.css'
})
export class ConsultaComponent implements OnInit, OnDestroy {

  cabecalhoInfo:Cabecalho = {
    titulo: 'Consultas',
    tituloBtn: 'Pacientes',
    btn: 'digital_wellbeing',
    rota: 'paciente'
  }
  formulario!: FormGroup;
  idPaciente!:number;
  disabled: boolean = true;
  consultaSubscription = new Subscription();
  dataForm = false;
  cpfInvalido = false;
  cpfState = '';
  dataAtual = new Date();
  dataAtualFormatada = new Date().toISOString().slice(0, 10);
  dataBtnNaoVerMais = '';
  mensagemConsultas!:string;
  btnNaoVerMais = false;

  constructor(
    private formBuilder:FormBuilder,
    private consultaService:ConsultaService,
    private pacienteService: PacienteService,
    private dadosCompartilhadosService: CompartilhamentoDadosService,
    private authService: AutenticacaoService,
    private route: Router,
    private dialog:MatDialog,
    public snackBar:MatSnackBar
    // public dialogRefConsulta:MatDialogRef<ModalPadraoComponent>
  ) {}

  ngOnInit(): void {
    this.authService.protecaoPaginas();
    this.dadosCompartilhadosService.setCabecalhoAtendenteInfo(this.cabecalhoInfo);
    this.consultaService.mensagemErro$.subscribe({
      next: (mensagemErro) => {
        const confirmacaoDialog:ConfirmModal = {
          titulo:'Erro',
          mensagem:mensagemErro,
          class:'erro'
        }
        this.dialog.open(ModalPadraoComponent, {
          data: confirmacaoDialog
        })
      }
    })

    this.abrirSnackBarConsultas();

    this.formulario = this.formBuilder.group({
      cpf: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/(.|\s)*\S(.|\s)*/),
        CustomValidators.isValidCpf()
      ])],
      data: '',
      hora: '',
      planoParticular: ['', Validators.required],
      idPaciente: -1,
      motivo: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.consultaSubscription.unsubscribe();
  }

  onSubmit(): void {
    if(!this.formulario.valid) {
      return;
    }
    let dataHora = '';
    this.formulario.value.data ? dataHora = this.formulario.value.data + 'T' + this.formulario.value.hora + 'Z' : '';
    const consulta:MarcarConsulta = {
      data:dataHora,
      planoParticular:String(this.formulario.value.planoParticular).toUpperCase(),
      motivo:this.formulario.value.motivo,
      idPaciente:this.idPaciente
    };
    if(this.formulario.value.data) {
      this.consultaService.cadastrarConsulta(consulta);
      this.consultaService.getDadoCompartilhado().subscribe({
        next: (consulta) => {
          if(consulta) {
            const consultaCadastrada:ConsultaModal = {
              titulo:'Cadastro',
              mensagem:'Consulta cadastrada com sucesso!',
              confirmacao:'confirmado',
              consulta: consulta
            }
            this.dialog.open(ModalConsultaConfirmadaComponent, {
              data: consultaCadastrada
            })
          }
        },
        error: (erro) => {
          console.log(erro);
        }
      })
    } else {
      const confirmacaoDialog:ConfirmModal = {
        titulo:'Encaixe',
        mensagem:'Horário não escolhido. Tentar marcar para hoje ?',
        class:'cadastrarAtualizar'
      }
      this.dialog.open(ModalPadraoComponent, {
        data: confirmacaoDialog
      }).afterClosed().subscribe(resultado => {
        if(resultado) {
          this.consultaService.cadastrarConsultaDoDia(consulta);
          this.consultaService.getDadoCompartilhado().subscribe({
            next: (consulta) => {
              if(consulta) {
                const consultaCadastrada:ConsultaModal = {
                  titulo:'Cadastro',
                  mensagem:'Consulta cadastrada com sucesso!',
                  confirmacao:'confirmado',
                  consulta: consulta
                }
                this.dialog.open(ModalConsultaConfirmadaComponent, {
                  data: consultaCadastrada
                });
              }
            },
            error: (erro) => {
              console.log(erro);
            }
          })
        }
      })
    }
  }

  idPacientePorCpf(): void {
    const cpf = this.formulario.value.cpf;
    if(cpf) {
      this.consultaSubscription = this.pacienteService.listarPacientePorCpf(cpf).subscribe({
        next: (paciente) => {
          this.idPaciente = paciente.id;
          this.disabled = false;
        },
        error: () => {
          const confirmacaoDialog:ConfirmModal = {
            titulo:'Erro',
            mensagem:'Paciente não encontrado, cadastrar ?',
            class:'erroOpcao'
          }
          this.dialog.open(ModalPadraoComponent, {
            data: confirmacaoDialog
          }).afterClosed().subscribe(resultado => {
            if(resultado) {
              this.disabled = true;
              this.dadosCompartilhadosService.setCpf(cpf);
              this.route.navigate(['/paciente']);
            } else {
              this.formulario.patchValue({cpf: ''})
            }
          })
        }
      });
    }
  }

  habilitarData() {
    this.formulario.value.data ? this.dataForm = true : this.dataForm = false;
  }

  abrirSnackBarConsultas() {
    const proximoDiaMilisegundos = 86400000;
    const proximoDia = String(new Date(this.dataAtual.getTime() + proximoDiaMilisegundos).toISOString()).slice(0, 10);
    this.consultaService.listarConsultasPorData(proximoDia).subscribe((consultas) => {
      let totalConsultasProximoDia = consultas.content.length;
      let mensagem = `Há ${totalConsultasProximoDia} consulta(s) para amanhã`;
      this.snackBar.open(mensagem, '', {
        duration: 2000
      })
    })
  }

  validarCpf() {
    const cpfInput = this.formulario.value.cpf;
    const cpfValidado = ValidaCpf.validar(cpfInput);
    if(cpfInput.length < 11 || cpfValidado?.cpfNotValid === true) {
      this.cpfInvalido = true;
      this.cpfState = 'invalido';
    } else {
      this.cpfInvalido = false;
      this.cpfState = '';
      this.idPacientePorCpf();
    }
  }

  gerarCpf() {
    this.formulario.patchValue({cpf: GerarCpf.generate()});
    this.idPacientePorCpf();
  }

}
