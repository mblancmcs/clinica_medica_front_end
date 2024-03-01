import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConsultaConfirmadaComponent } from './modal-consulta-confirmada.component';

describe('ModalConsultaConfirmadaComponent', () => {
  let component: ModalConsultaConfirmadaComponent;
  let fixture: ComponentFixture<ModalConsultaConfirmadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalConsultaConfirmadaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalConsultaConfirmadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
