import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaPacientesComponent } from './tabela-pacientes.component';

describe('TabelaPacientesComponent', () => {
  let component: TabelaPacientesComponent;
  let fixture: ComponentFixture<TabelaPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelaPacientesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabelaPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
