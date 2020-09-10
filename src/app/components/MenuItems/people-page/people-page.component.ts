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

  allUsers: User[] = [];
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
        console.log(this.randUserIndex[i]);
        this.afs.collection('users', ref => ref.where('countId', '==', this.randUserIndex[i]))
          .get().toPromise().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.allUsers.push(doc.data() as User);
          });
        });
      }
    });
  }



}
