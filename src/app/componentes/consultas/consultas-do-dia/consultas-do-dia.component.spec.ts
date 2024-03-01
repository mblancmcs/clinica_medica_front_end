import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultasDoDiaComponent } from './consultas-do-dia.component';

describe('ConsultasDoDiaComponent', () => {
  let component: ConsultasDoDiaComponent;
  let fixture: ComponentFixture<ConsultasDoDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultasDoDiaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultasDoDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
