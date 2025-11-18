import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarQuartos } from './criar-quartos';

describe('CriarQuartos', () => {
  let component: CriarQuartos;
  let fixture: ComponentFixture<CriarQuartos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarQuartos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarQuartos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
