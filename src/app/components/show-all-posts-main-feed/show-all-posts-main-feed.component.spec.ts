import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAllPostsMainFeedComponent } from './show-all-posts-main-feed.component';

describe('ShowAllPostsMainFeedComponent', () => {
  let component: ShowAllPostsMainFeedComponent;
  let fixture: ComponentFixture<ShowAllPostsMainFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowAllPostsMainFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAllPostsMainFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
