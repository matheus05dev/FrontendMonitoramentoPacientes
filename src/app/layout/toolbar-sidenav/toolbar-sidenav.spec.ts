import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarSidenav } from './toolbar-sidenav';

describe('ToolbarSidenav', () => {
  let component: ToolbarSidenav;
  let fixture: ComponentFixture<ToolbarSidenav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarSidenav]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarSidenav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
