import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoLeitura } from './info-leitura';

describe('InfoLeitura', () => {
  let component: InfoLeitura;
  let fixture: ComponentFixture<InfoLeitura>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoLeitura]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoLeitura);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
