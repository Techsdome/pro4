import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import * as $ from 'jquery';
import {ErrorStateMatcher} from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent implements OnInit {
  myForm: FormGroup;

  public openMainLogin = true;
  firstname: string;
  lastname: string;

  matcher = new MyErrorStateMatcher();

  constructor(public authService: AuthService, private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: [''],
      password: ['', [Validators.required]],
      confirmPassword: [''],
      email: ['', [Validators.required, Validators.email]]
    });

  }

  checkPasswords(group: FormGroup) {
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  toggleLoginRegister() {
    this.openMainLogin = !this.openMainLogin;
  }

  ngOnInit() {
    $(document).ready(function() {
      // Transition effect for navbar
      $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
          $('#mainNav').addClass('navbar-shrink');
        } else {
          $('#mainNav').removeClass('navbar-shrink');
        }
      });
    });
  }


}
