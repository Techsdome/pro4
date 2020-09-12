import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedProjectComponent } from './suggested-project.component';

describe('SuggestedProjectComponent', () => {
  let component: SuggestedProjectComponent;
  let fixture: ComponentFixture<SuggestedProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestedProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
