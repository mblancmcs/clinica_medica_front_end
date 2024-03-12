import { Component, OnDestroy, OnInit } from '@angular/core';
import { PacienteService } from '../../../service/paciente/paciente.service';
import { GetPaciente, ModeloGetPaciente, ModeloPaciente, Paciente } from '../../../models/paciente-intefaces';
import { Subscription, catchError, debounceTime, distinctUntilChanged, filter, of, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalPacienteComponent } from '../modal-paciente/modal-paciente.component';
import { EncurtarNomePipe } from '../../../pipes/encurtar-nome.pipe';
import { Router } from '@angular/router';
import { highlightedStateTrigger, listStateTrigger, shakeTrigger } from '../../../animacoes';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-tabela-pacientes',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    EncurtarNomePipe,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  providers: [
    provideNgxMask()
  ],
  animations: [
    highlightedStateTrigger,
    listStateTrigger
  ],
  templateUrl: './tabela-pacientes.component.html',
  styleUrl: './tabela-pacientes.component.css'
})
export class TabelaPacientesComponent implements OnInit, OnDestroy {

  paginaAtual = 0;
  totalPaginas = 0;
  campoCpf = new FormControl();
  consultaPorCpf = false;
  alertSemAtendimentos = false;
  getPacientes!:GetPaciente;
  getPacientesPorCpf:GetPaciente = new ModeloGetPaciente();
  indexPaciente = -1;
  private pacienteSubscription = new Subscription();

  pacientesPorCpf$ = this.campoCpf.valueChanges.pipe(
    filter(input => input !== ''),
    debounceTime(150),
    distinctUntilChanged(),
    switchMap(
      (input) => this.pacienteService.listarPacientesPorCpf(input, this.paginaAtual)
    ),
    tap((pacientes) => {
      this.getPacientesPorCpf = pacientes;
      this.paginaAtual = 0;
      this.totalPaginas = pacientes.totalPages;
    }),
    catchError(erro => {
      console.log(erro);
      this.paginaAtual = 0;
      this.totalPaginas = this.getPacientes.totalPages;
      return of(); // operador do rxjs que pode emitir um valor e "completar" o Observable
    })
  )

  constructor(
    private pacienteService:PacienteService,
    public dialog:MatDialog,
    public route:Router
  ) {}

  ngOnInit(): void {
    this.listarPacientes();
    this.pacienteSubscription = this.campoCpf.valueChanges.subscribe((input) => {
      if(input) {
        this.totalPaginas = this.getPacientesPorCpf.totalPages;
        this.consultaPorCpf = true;
      } else {
        this.consultaPorCpf = false;
        this.paginaAtual = 0;
        this.totalPaginas = this.getPacientes.totalPages;
      }
    });
  }

  ngOnDestroy(): void {
    this.pacienteSubscription.unsubscribe();
  }

  detalhesPaciente(paciente:Paciente) {
    let dialogRef = this.dialog.open(ModalPacienteComponent, {
      width: '700px',
      data: paciente
    }).afterClosed().subscribe(() => {
      this.recarregarComponente();
    })
    /* dialogRef.afterClosed().subscribe(resultado  => {

    }) */
  }

  listarPacientes(pagina = 0) {
    this.pacienteService.listarPacientes(pagina);
    this.pacienteSubscription = this.pacienteService.pacientes$.subscribe(pacientes => {
      this.getPacientes = pacientes;
      this.totalPaginas = pacientes.totalPages;
    });
  }

  buscarPorCpf() {
    if(this.campoCpf.value) {
      this.consultaPorCpf = true;
      this.pacienteSubscription = this.pacienteService.listarPacientesPorCpf(Number(this.campoCpf.value), this.paginaAtual)
        .subscribe({
          next: (pacientes) => {
            this.getPacientesPorCpf = pacientes;
            this.totalPaginas = pacientes.totalPages;
          },
          error: (erro) => {
            console.log("Erro: " + erro.message);
            this.getPacientesPorCpf = new ModeloGetPaciente();
            this.consultaPorCpf = false;
            this.paginaAtual = 0;
            this.totalPaginas = this.getPacientes.totalPages;
          }
        })
    } else {
      this.consultaPorCpf = false;
      this.paginaAtual = 0;
      this.totalPaginas = this.getPacientes.totalPages;
    }
  }

  mudarPagina(proxima:boolean) {
    proxima ? this.paginaAtual++ : this.paginaAtual--;
    if((proxima && this.paginaAtual < this.totalPaginas)
      || (!proxima && this.paginaAtual >= 0)) {
      if(this.consultaPorCpf) {
        this.buscarPorCpf();
      } else {
        this.listarPacientes(this.paginaAtual);
      }
    } else {
      proxima ? this.paginaAtual-- : this.paginaAtual++;
      this.alertSemAtendimentos = true;
    }
  }

  recarregarComponente() {
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([this.route.url]);
  }

}
