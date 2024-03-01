import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultasPorCpfComponent } from './consulta-atendimento.component';

describe('ConsultasPorCpfComponent', () => {
  let component: ConsultasPorCpfComponent;
  let fixture: ComponentFixture<ConsultasPorCpfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultasPorCpfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultasPorCpfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
