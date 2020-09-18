import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {AngularFireStorage} from 'angularfire2/storage';

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
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isOptional = true;

  public openMainLogin = true;
  firstname: string;
  lastname: string;
  photoURL: any;
  file: File;
  progress: any = 0;

  matcher = new MyErrorStateMatcher();
  defaultPhotoURL: any;
  private toastr: any;
  imageSrc: string;

  constructor(public authService: AuthService, private formBuilder: FormBuilder, private storage: AngularFireStorage) {
  }

  checkPasswords(group: FormGroup) {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  toggleLoginRegister() {
    this.openMainLogin = !this.openMainLogin;
  }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: [''],
    }, {validator: this.checkPasswords});
    this.secondFormGroup = this.formBuilder.group({
      userJob: [''],
      userDescription: [''],
      fileSource: ['']
    });

    this.storage.ref('Users/Default_ProfilePicture/default_pic.png').getDownloadURL().toPromise().then(url => {
      this.defaultPhotoURL = url;
      console.log(url);
    });

  }


  fileUpload(e: any) {
    const reader = new FileReader();

    const uploadPicInput = document.getElementById('picUpload');
    uploadPicInput.addEventListener('change', () => {
      this.file = e.target.files[0];
      reader.readAsDataURL(this.file);

      reader.onload = () => {

        this.imageSrc = reader.result as string;

        this.secondFormGroup.patchValue({
          fileSource: reader.result
        });

      };
    });
  }
}
