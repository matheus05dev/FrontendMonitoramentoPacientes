import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoFuncionarios } from './info-funcionario';

describe('InfoFuncionarios', () => {
  let component: InfoFuncionarios;
  let fixture: ComponentFixture<InfoFuncionarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoFuncionarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoFuncionarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
