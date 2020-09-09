import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentProjectsComponent } from './present-projects.component';

describe('PresentProjectsComponent', () => {
  let component: PresentProjectsComponent;
  let fixture: ComponentFixture<PresentProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresentProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
