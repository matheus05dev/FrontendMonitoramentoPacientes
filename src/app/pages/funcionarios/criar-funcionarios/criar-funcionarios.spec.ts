import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarFuncionarios } from './criar-funcionarios';

describe('CriarFuncionarios', () => {
  let component: CriarFuncionarios;
  let fixture: ComponentFixture<CriarFuncionarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarFuncionarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarFuncionarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
