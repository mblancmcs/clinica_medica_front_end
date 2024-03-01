import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAtendimentoComponent } from './modal-atendimento.component';

describe('DetalhesAtendimentoComponent', () => {
  let component: ModalAtendimentoComponent;
  let fixture: ComponentFixture<ModalAtendimentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAtendimentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAtendimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
