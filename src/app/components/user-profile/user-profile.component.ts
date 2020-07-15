import {Component, OnInit} from '@angular/core';
import {NewProjectComponent} from '../new-project/new-project.component';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  public uid: any;
  userObject = history.state.data;
  private navigationSubscription: any;

  constructor(
    public newproject: NewProjectComponent,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

  toggleProject() {
    this.newproject.toggleScreen();
  }

}
