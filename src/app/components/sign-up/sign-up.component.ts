import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit {


    constructor(public afs: AngularFirestore, public authService: AuthService) {
    }

    ngOnInit() {
        console.log('test');
    }

}
