import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAtendimentos } from './editar-atendimentos';

describe('EditarAtendimentos', () => {
  let component: EditarAtendimentos;
  let fixture: ComponentFixture<EditarAtendimentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarAtendimentos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarAtendimentos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
