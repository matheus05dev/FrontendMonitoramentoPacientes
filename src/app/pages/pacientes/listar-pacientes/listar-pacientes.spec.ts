import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPacientes } from './listar-pacientes';

describe('ListarPacientes', () => {
  let component: ListarPacientes;
  let fixture: ComponentFixture<ListarPacientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarPacientes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarPacientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
