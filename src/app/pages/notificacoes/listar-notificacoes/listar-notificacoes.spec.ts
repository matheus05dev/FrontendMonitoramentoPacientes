import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarNotificacoes } from './listar-notificacoes';

describe('ListarNotificacoes', () => {
  let component: ListarNotificacoes;
  let fixture: ComponentFixture<ListarNotificacoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarNotificacoes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarNotificacoes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
