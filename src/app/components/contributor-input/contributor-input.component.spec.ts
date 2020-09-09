import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorInputComponent } from './contributor-input.component';

describe('ContributorInputComponent', () => {
  let component: ContributorInputComponent;
  let fixture: ComponentFixture<ContributorInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContributorInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
