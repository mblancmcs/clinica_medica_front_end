import { Routes } from '@angular/router';
import { AtendimentoMedicoComponent } from './views/atendimento-medico/atendimento-medico.component';
import { ConsultaComponent } from './views/consulta/consulta.component';
import { HistoricoAtendimentosComponent } from './views/historico-atendimentos/historico-atendimentos.component';
import { HomeComponent } from './views/home/home.component';
import { PacienteComponent } from './views/paciente/paciente.component';
import { AdminComponent } from './views/admin/admin.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path:'admin',
    component:AdminComponent
  },
  {
    path: 'atendimento',
    component: AtendimentoMedicoComponent
  },
  {
    path: 'consulta',
    component: ConsultaComponent
  },
  {
    path: 'historicoAtendimentos',
    component: HistoricoAtendimentosComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'paciente',
    component: PacienteComponent
  }
];
