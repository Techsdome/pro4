import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-main-navbar',
    templateUrl: './main-navbar.component.html',
    styleUrls: ['./main-navbar.component.css']
})
export class MainNavbarComponent implements OnInit {
    public status = false;
    public menuClicked = false;

    animateOn() {
        this.status = !this.status;
    }

    showMenuBar() {
        this.menuClicked = !this.menuClicked;
    }

    constructor() {
    }

    ngOnInit() {
    }

}
