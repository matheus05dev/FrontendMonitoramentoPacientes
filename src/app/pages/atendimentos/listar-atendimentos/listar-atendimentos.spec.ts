import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAtendimentos } from './listar-atendimentos';

describe('ListarAtendimentos', () => {
  let component: ListarAtendimentos;
  let fixture: ComponentFixture<ListarAtendimentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarAtendimentos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarAtendimentos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
