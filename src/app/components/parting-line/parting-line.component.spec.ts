import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartingLineComponent } from './parting-line.component';

describe('PartingLineComponent', () => {
  let component: PartingLineComponent;
  let fixture: ComponentFixture<PartingLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartingLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartingLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
