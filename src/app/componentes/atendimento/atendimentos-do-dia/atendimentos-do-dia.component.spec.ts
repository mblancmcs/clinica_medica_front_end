import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtendimentosDoDiaComponent } from './atendimentos-do-dia.component';

describe('AtendimentosDoDiaComponent', () => {
  let component: AtendimentosDoDiaComponent;
  let fixture: ComponentFixture<AtendimentosDoDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtendimentosDoDiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtendimentosDoDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
