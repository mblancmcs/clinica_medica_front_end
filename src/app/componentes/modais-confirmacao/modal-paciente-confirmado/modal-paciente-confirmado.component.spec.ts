import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPacienteConfirmadoComponent } from './modal-paciente-confirmado.component';

describe('ModalPacienteConfirmadoComponent', () => {
  let component: ModalPacienteConfirmadoComponent;
  let fixture: ComponentFixture<ModalPacienteConfirmadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPacienteConfirmadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalPacienteConfirmadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
