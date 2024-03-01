import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUsuarioConfirmadoComponent } from './modal-usuario-confirmado.component';

describe('ModalUsuarioConfirmadoComponent', () => {
  let component: ModalUsuarioConfirmadoComponent;
  let fixture: ComponentFixture<ModalUsuarioConfirmadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalUsuarioConfirmadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalUsuarioConfirmadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
