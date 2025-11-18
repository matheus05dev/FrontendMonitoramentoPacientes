import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarFuncionarios } from './listar-funcionarios';

describe('ListarFuncionarios', () => {
  let component: ListarFuncionarios;
  let fixture: ComponentFixture<ListarFuncionarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarFuncionarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarFuncionarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
