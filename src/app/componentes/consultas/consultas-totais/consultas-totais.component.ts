import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { ConsultaService } from '../../../service/consulta/consulta.service';
import { Subscription, catchError, debounce, debounceTime, distinctUntilChanged, filter, map, of, shareReplay, startWith, switchMap, takeWhile, tap, withLatestFrom } from 'rxjs';
import { Consulta, GetConsulta, getModeloGetConsulta } from '../../../models/consulta-interfaces';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalConsultaComponent } from '../modal-consulta/modal-consulta.component';
import { EncurtarNomePipe } from '../../../pipes/encurtar-nome.pipe';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { highlightedStateTrigger, listStateTrigger } from '../../../animacoes';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-consultas-totais',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    EncurtarNomePipe,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  providers: [
    provideNgxMask()
  ],
  animations: [
    listStateTrigger,
    highlightedStateTrigger
  ],
  templateUrl: './consultas-totais.component.html',
  styleUrl: './consultas-totais.component.css'
})
export class ConsultasTotaisComponent implements OnInit, OnDestroy {

  consultaSubscription:Subscription = new Subscription();
  getConsultas:GetConsulta = new getModeloGetConsulta();
  getConsultasPorCpf:GetConsulta = new getModeloGetConsulta();
  consultasPorCpf:boolean = false;
  paginaAtual = 0;
  totalPaginas = 0;
  alertSemAtendimentos = false;
  campoCpf = new FormControl();
  indexConsulta = -1;

  consultasPorCpf$ = this.campoCpf.valueChanges.pipe(
    filter((input) => input !== ''),
    debounceTime(150),
    distinctUntilChanged(),
    switchMap(
      (input) => this.consultaService.listarConsultasPorCpf(input, this.paginaAtual)
    ),
    tap((consultas) => {
      this.getConsultasPorCpf = consultas;
      this.paginaAtual = 0;
      this.totalPaginas = consultas.totalPages;
    }),
    catchError(erro => {
      console.log(erro);
      this.paginaAtual = 0;
      this.totalPaginas = this.getConsultas.totalPages;
      return of(); // operador do rxjs que pode emitir um valor e "completar" o Observable
    })
  )

  constructor(
    private consultaService:ConsultaService,
    public dialog:MatDialog,
    public route:Router
  ) {}

  ngOnInit(): void {
    this.listarConsultas();
    this.consultaSubscription = this.campoCpf.valueChanges.subscribe((input) => {
      if(input) {
        this.consultasPorCpf = true;
        this.totalPaginas = this.getConsultasPorCpf.totalPages;
      } else {
        this.consultasPorCpf = false;
        this.totalPaginas = this.getConsultas.totalPages;
      }
    });
  }

  ngOnDestroy(): void {
    this.consultaSubscription.unsubscribe();
  }

  detalhesConsulta(consulta:Consulta) {
    let dialogRef = this.dialog.open(ModalConsultaComponent, {
      width: '700px',
      data: consulta
    }).afterClosed().subscribe( () => {
      this.consultasPorCpf ? this.buscarCpf() : this.listarConsultas(this.paginaAtual);
    })
    /* dialogRef.afterClosed().subscribe(resultado  => {

    }) */
  }

  listarConsultas(pagina = 0) {
    this.consultaService.listarConsultas(pagina);
    this.consultaSubscription = this.consultaService.consultas$.subscribe(consultas => {
      this.getConsultas = consultas;
      this.totalPaginas = consultas.totalPages;
    })
  }

  buscarCpf() {
    if(this.campoCpf.value) {
      this.consultasPorCpf = true;
      this.consultaService.listarConsultasPorCpf(Number(this.campoCpf.value), this.paginaAtual)
        .subscribe(consultas => {
        this.getConsultasPorCpf = consultas;
        this.totalPaginas = consultas.totalPages;
      })
    } else {
      this.paginaAtual = 0;
      this.totalPaginas = this.getConsultas.totalPages;
    }
  }

  mudarPagina(proxima:boolean) {
    proxima ? this.paginaAtual++ : this.paginaAtual--;
    if((proxima && this.paginaAtual < this.totalPaginas)
      || (!proxima && this.paginaAtual >= 0)) {
      if(this.consultasPorCpf) {
        this.buscarCpf();
      } else {
        this.listarConsultas(this.paginaAtual);
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
