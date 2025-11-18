import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarQuartos } from './editar-quartos';

describe('EditarQuartos', () => {
  let component: EditarQuartos;
  let fixture: ComponentFixture<EditarQuartos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarQuartos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarQuartos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
