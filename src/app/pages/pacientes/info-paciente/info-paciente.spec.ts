import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPacientes } from './info-paciente';

describe('InfoPacientes', () => {
  let component: InfoPacientes;
  let fixture: ComponentFixture<InfoPacientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoPacientes],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoPacientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
