import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsCreate } from './reservations-create';

describe('ReservationsCreate', () => {
  let component: ReservationsCreate;
  let fixture: ComponentFixture<ReservationsCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationsCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationsCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
