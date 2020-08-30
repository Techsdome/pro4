import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorViewComponent } from './contributor-view.component';

describe('ContributorViewComponent', () => {
  let component: ContributorViewComponent;
  let fixture: ComponentFixture<ContributorViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContributorViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
