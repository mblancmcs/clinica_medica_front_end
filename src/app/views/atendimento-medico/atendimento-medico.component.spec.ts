import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtendimentoMedicoComponent } from './atendimento-medico.component';

describe('AtendimentoMedicoComponent', () => {
  let component: AtendimentoMedicoComponent;
  let fixture: ComponentFixture<AtendimentoMedicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtendimentoMedicoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AtendimentoMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
