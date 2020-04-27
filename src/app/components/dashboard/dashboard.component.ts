import { Component, OnInit } from '@angular/core';
import {NewProjectComponent} from '../new-project/new-project.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public addproject: NewProjectComponent) { }

  ngOnInit() {
  }

}
