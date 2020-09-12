import { Component, OnInit } from '@angular/core';
import {User} from 'firebase';
import {DataServiceService} from '../../../shared/services/data-service.service';
import {AngularFirestore} from 'angularfire2/firestore';


@Component({
  selector: 'app-people-page',
  templateUrl: './people-page.component.html',
  styleUrls: ['./people-page.component.css']
})
export class PeoplePageComponent implements OnInit {
  private firebase: any;

  constructor(private userSerive: DataServiceService, private afs: AngularFirestore) { }

  randomUsers: User[] = [];
  allUsers: any[] = [];
  numUsers;
  randUserIndex: number[] = [];

  ngOnInit(): void {

    this.afs.doc('users/userCount').get().toPromise().then(doc => {
      if (doc.exists) {
        this.numUsers = doc.data().numberUsers;
      }
    }).then(() => {

      while (Object.keys(this.randUserIndex).length < 3) {
        const randomIndex = Math.floor(Math.random() * this.numUsers) + 1;
        if (this.randUserIndex.indexOf(randomIndex) === -1) { this.randUserIndex.push(randomIndex); }
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

    this.setAlphabet();
  }

  setAlphabet() {
    const s = new Set();

    this.afs.collection('users').get().toPromise().then(querySnapshot => {
      querySnapshot.forEach((doc) => {
        if (doc.data().hasOwnProperty('lastname')) {
        this.allUsers.push(
            { lastName: doc.data().lastname,
              firstName: doc.data().firstname,
              job: doc.data().job,
              uid: doc.data().uid,
              photoURL: doc.data().photoURL
          });
        this.allUsers.sort((a, b) => {
            const fa = a.lastName.toLowerCase();
            const fb = b.lastName.toLowerCase();

            if (fa < fb) {
              return -1;
            }
            if (fa > fb) {
              return 1;
            }
            return 0;
          });
        }
      });
    });
  }


}
