import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoNotificacao } from './info-notificacao';

describe('InfoNotificacao', () => {
  let component: InfoNotificacao;
  let fixture: ComponentFixture<InfoNotificacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoNotificacao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoNotificacao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
