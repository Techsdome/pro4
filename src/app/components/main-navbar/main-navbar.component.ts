import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {User} from '../../shared/services/user';
import {Observable} from 'rxjs';
import {DataServiceService} from '../../shared/services/data-service.service';
import {Item} from '../../models/Item';
import {trigger, state, style, animate, transition, keyframes, query, stagger} from '@angular/animations';

// const directory = document.querySelector('.bubble').getBoundingClientRect();

@Component({
    selector: 'app-main-navbar',
    templateUrl: './main-navbar.component.html',
    styleUrls: ['./main-navbar.component.css'],
    animations: [
        trigger('slide', [
          transition(':enter', [
            style({transform: 'translate(0px, 150px)'}),
            animate('1s')
          ]),
        ]),
    ]
})
export class MainNavbarComponent implements OnInit {


    user: Observable<User>;
    stat: string;

    photoURL: string;

    public status = false;
    public menuClicked = false;

    constructor(public authService: AuthService, public  dataService: DataServiceService) {
    }

    slideIt(dat) {
      this.stat = dat;
    }

    animateOn() {
        this.status = !this.status;
    }

    showMenuBar() {
        this.menuClicked = !this.menuClicked;
    }

    ngOnInit() {
        this.authService.afAuth.authState.subscribe(user => {
            if (user) {
                this.photoURL = user.photoURL;
            }
        });
    }
}
