import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPacienteComponent } from './modal-paciente.component';

describe('ModalPacienteComponent', () => {
  let component: ModalPacienteComponent;
  let fixture: ComponentFixture<ModalPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPacienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
