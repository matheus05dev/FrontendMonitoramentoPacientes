import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAtendimento } from './info-atendimento';

describe('InfoAtendimento', () => {
  let component: InfoAtendimento;
  let fixture: ComponentFixture<InfoAtendimento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoAtendimento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoAtendimento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
