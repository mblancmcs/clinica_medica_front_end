import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultasTotaisComponent } from './consultas-totais.component';

describe('ConsultasTotaisComponent', () => {
  let component: ConsultasTotaisComponent;
  let fixture: ComponentFixture<ConsultasTotaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultasTotaisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultasTotaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
