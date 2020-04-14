import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';

@Component({
    selector: 'app-main-navbar',
    templateUrl: './main-navbar.component.html',
    styleUrls: ['./main-navbar.component.css']
})
export class MainNavbarComponent implements OnInit {
    public status = false;
    public menuClicked = false;

  constructor(
    public authService: AuthService
  ) {
  }

    animateOn() {
        this.status = !this.status;
    }

    showMenuBar() {
        this.menuClicked = !this.menuClicked;
    }

    ngOnInit() {
    }

}
