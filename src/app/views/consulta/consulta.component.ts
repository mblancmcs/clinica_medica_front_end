import { AfterContentChecked, AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConsultaService } from '../../service/consulta/consulta.service';
import { Consulta, MarcarConsulta, getModeloConsulta } from '../../models/consulta-interfaces';
import { PacienteService } from '../../service/paciente/paciente.service';
import { Router } from '@angular/router';
import { CompartilhamentoDadosService } from '../../service/compartilhamento-dados.service';
import { ConsultasTotaisComponent } from '../../componentes/consultas/consultas-totais/consultas-totais.component';
import { Subscription, catchError, of } from 'rxjs';
import { Cabecalho } from '../../componentes/cabecalho/cabecalho-interface';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmModal, ConsultaModal } from '../../componentes/modais-confirmacao/interface-modais';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalPadraoComponent } from '../../componentes/modais-confirmacao/modal-padrao/modal-padrao.component';
import { ModalConsultaConfirmadaComponent } from '../../componentes/modais-confirmacao/modal-consulta-confirmada/modal-consulta-confirmada.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { AutenticacaoService } from '../../service/autenticacao/autenticacao.service';
import { ValidaCpf } from '../../util/ValidaCpf';
import { MensagemComponent } from '../../componentes/mensagem/mensagem.component';
import { CommonModule } from '@angular/common';
import { CustomValidators } from '../../CustomValidators';
import { GerarCpf } from '../../util/GerarCpf';

@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConsultasTotaisComponent,
    MatIconModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MensagemComponent
  ],
  providers: [
    provideNgxMask()
  ],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.css'
})
export class ConsultaComponent implements OnInit, OnDestroy {

  cabecalhoInfo:Cabecalho = {
    titulo: 'Consultas',
    btn: 'digital_wellbeing',
    rota: 'paciente'
  }
  formulario!: FormGroup;
  idPaciente!:number;
  disabled: boolean = true;
  consultaSubscription = new Subscription();
  dataForm = false;
  cpfInvalido = false;
  dataAtual = new Date().toISOString().slice(0, 10);

  constructor(
    private formBuilder:FormBuilder,
    private consultaService:ConsultaService,
    private pacienteService: PacienteService,
    private dadosCompartilhadosService: CompartilhamentoDadosService,
    private authService: AutenticacaoService,
    private route: Router,
    private dialog:MatDialog,
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
    console.log(cpf);
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

  validarCpf() {
    const cpfInput = this.formulario.value.cpf;
    const cpfValidado = ValidaCpf.validar(cpfInput);
    if(cpfInput.length < 11 || cpfValidado?.cpfNotValid === true) {
      this.cpfInvalido = true;
    } else {
      this.cpfInvalido = false;
      this.idPacientePorCpf();
    }
  }

  gerarCpf() {
    this.formulario.patchValue({cpf: GerarCpf.generate()});
    this.idPacientePorCpf();
  }

}
