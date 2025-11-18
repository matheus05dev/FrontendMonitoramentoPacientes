import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoQuarto } from './info-quarto';

describe('InfoQuarto', () => {
  let component: InfoQuarto;
  let fixture: ComponentFixture<InfoQuarto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoQuarto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoQuarto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
