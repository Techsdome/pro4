import { Component, OnInit } from '@angular/core';
import {NewProjectComponent} from "../new-project/new-project.component";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(public newproject: NewProjectComponent) { }

  ngOnInit(): void {
  }

  toggleProject(){
    this.newproject.toggleScreen();
  }
}
