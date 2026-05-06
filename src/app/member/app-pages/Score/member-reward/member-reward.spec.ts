import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberReward } from './member-reward';

describe('MemberReward', () => {
  let component: MemberReward;
  let fixture: ComponentFixture<MemberReward>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MemberReward],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberReward);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
