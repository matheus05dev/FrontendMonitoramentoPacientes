import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarLeituras } from './listar-leituras';

describe('ListarLeituras', () => {
  let component: ListarLeituras;
  let fixture: ComponentFixture<ListarLeituras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarLeituras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarLeituras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
