import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarQuartos } from './listar-quartos';

describe('ListarQuartos', () => {
  let component: ListarQuartos;
  let fixture: ComponentFixture<ListarQuartos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarQuartos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarQuartos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
