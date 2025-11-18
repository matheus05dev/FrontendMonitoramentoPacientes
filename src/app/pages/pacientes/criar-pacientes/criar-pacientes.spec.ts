import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarPacientes } from './criar-pacientes';

describe('CriarPacientes', () => {
  let component: CriarPacientes;
  let fixture: ComponentFixture<CriarPacientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarPacientes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarPacientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
