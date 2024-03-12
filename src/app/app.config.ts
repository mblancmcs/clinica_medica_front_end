import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { AutenticacaoService } from './service/autenticacao/autenticacao.service';
import { AuthGuardService } from './service/autenticacao/auth-guard.service';
import { AuthInterceptorService } from './service/autenticacao/auth-interceptor.service';
import { CompartilhamentoDadosService } from './service/compartilhamento-dados.service';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { IConfig, provideEnvironmentNgxMask } from 'ngx-mask';
import { ConsultaService } from './service/consulta/consulta.service';
import { AtendimentoService } from './service/atendimento/atendimento.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(),
    provideAnimations(),
    provideZoneChangeDetection(),
    provideEnvironmentNgxMask(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } },
    // provideNoopAnimations()
]
};

const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: false,
  };
};
