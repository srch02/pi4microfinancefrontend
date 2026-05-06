import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitClaim } from './submit-claim';

describe('SubmitClaim', () => {
  let component: SubmitClaim;
  let fixture: ComponentFixture<SubmitClaim>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmitClaim],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitClaim);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
