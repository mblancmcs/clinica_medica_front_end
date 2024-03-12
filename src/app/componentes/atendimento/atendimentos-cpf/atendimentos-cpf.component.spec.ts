import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtendimentosPorCpfComponent } from './atendimentos-cpf.component';

describe('AtendimentosPorCpfComponent', () => {
  let component: AtendimentosPorCpfComponent;
  let fixture: ComponentFixture<AtendimentosPorCpfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtendimentosPorCpfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtendimentosPorCpfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
