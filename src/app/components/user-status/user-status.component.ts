import {Component, OnInit} from '@angular/core';
import { PresenceService } from '../../services/presence.service';
import * as firebase from 'firebase';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.css']
})
export class UserStatusComponent implements OnInit {

  uid = firebase.auth().currentUser.uid;

  // presence$;

  constructor(
    public authService: AuthService
  ) {
  }

  ngOnInit() {
    // this.presence$ = this.presence.getPresence(this.uid);
  }

}
