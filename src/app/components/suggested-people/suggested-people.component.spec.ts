import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedPeopleComponent } from './suggested-people.component';

describe('SuggestedPeopleComponent', () => {
  let component: SuggestedPeopleComponent;
  let fixture: ComponentFixture<SuggestedPeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestedPeopleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
