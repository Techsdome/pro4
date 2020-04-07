import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { NewProjectService } from '../../shared/services/new-project.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
