import {Component, OnInit} from '@angular/core';
import {User} from '../../shared/services/user';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../../shared/services/auth.service';
import {DataServiceService} from '../../shared/services/data-service.service';

@Component({
  selector: 'app-suggested-people',
  templateUrl: './suggested-people.component.html',
  styleUrls: ['./suggested-people.component.css']
})
export class SuggestedPeopleComponent implements OnInit {

  randomUsers: User[] = [];
  numUsers;
  randUserIndex: number[] = [];
  numSearchPeople: number;


  constructor(public storage: AngularFireStorage, public afs: AngularFirestore,
              public authService: AuthService) {
  }

  ngOnInit(): void {
    this.afs.doc('users/userCount').get().toPromise().then(doc => {
      if (doc.exists) {
        this.numUsers = doc.data().numberUsers;
        if (this.numUsers < 4) {
          this.numSearchPeople = this.numUsers;
        } else {
          this.numSearchPeople = 4;
        }
      }
    }).then(() => {
      while (Object.keys(this.randUserIndex).length < this.numSearchPeople) {
        const randomIndex = Math.floor(Math.random() * this.numUsers) + 1;
        if (this.randUserIndex.indexOf(randomIndex) === -1) {
          this.randUserIndex.push(randomIndex);
        }
      }

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.randUserIndex.length; i++) {
        this.afs.collection('users', ref => ref.where('countId', '==', this.randUserIndex[i]))
          .get().toPromise().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.randomUsers.push(doc.data() as User);
          });
        });
      }
    });
  }

}
