import {Component, OnInit} from '@angular/core';
/*import { AngularFireAuth } from '@angular/fire/auth';*/
import {AuthService} from '../../shared/services/auth.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css']
})

export class SignInComponent implements OnInit {
    public openMainLogin = true;
    firstname: string;
    lastname: string;

    constructor(
        public authService: AuthService
    ) {}

    toggleLoginRegister() {
        this.openMainLogin = !this.openMainLogin;
    }

    ngOnInit() {
      $(document).ready(function(){
        // Transition effect for navbar
        $(window).scroll(function() {
          if($(this).scrollTop() > 100) {
              $('#mainNav').addClass('navbar-shrink');
            } else {
              $('#mainNav').removeClass('navbar-shrink');
            }
        });
      });
    }

}
