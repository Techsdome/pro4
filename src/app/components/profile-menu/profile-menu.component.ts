// import {Component, Input, OnInit} from '@angular/core';
//
// @Component({
//     selector: 'app-profile-menu',
//     templateUrl: './profile-menu.component.html',
//     styleUrls: ['./profile-menu.component.css']
// })
// export class ProfileMenuComponent implements OnInit {
//
//
//     constructor() {
//     }
//
//     ngOnInit(): void {
//     }
// }

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {User} from '../../shared/services/user';
import {NewProjectService} from '../../shared/services/new-project.service';
import {DataServiceService} from '../../shared/services/data-service.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.css']
})
export class ProfileMenuComponent implements OnInit {

  user: User;
  @Input() links: any[];

  constructor(private dataService: DataServiceService, private authService: AuthService, private pservice: NewProjectService) {
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

}

