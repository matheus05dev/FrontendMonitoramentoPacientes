import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarAtendimentos } from './criar-atendimentos';

describe('CriarAtendimentos', () => {
  let component: CriarAtendimentos;
  let fixture: ComponentFixture<CriarAtendimentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarAtendimentos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarAtendimentos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
