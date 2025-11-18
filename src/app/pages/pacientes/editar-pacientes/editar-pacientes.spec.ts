import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPacientes } from './editar-pacientes';

describe('EditarPacientes', () => {
  let component: EditarPacientes;
  let fixture: ComponentFixture<EditarPacientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPacientes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPacientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
