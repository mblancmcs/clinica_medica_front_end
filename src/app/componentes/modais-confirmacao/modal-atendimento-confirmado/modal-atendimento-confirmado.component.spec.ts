import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAtendimentoConfirmadoComponent } from './modal-atendimento-confirmado.component';

describe('ModalAtendimentoConfirmadoComponent', () => {
  let component: ModalAtendimentoConfirmadoComponent;
  let fixture: ComponentFixture<ModalAtendimentoConfirmadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAtendimentoConfirmadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAtendimentoConfirmadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
