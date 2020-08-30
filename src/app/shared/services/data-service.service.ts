import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Item} from '../../models/Item';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {User} from './user';

@Injectable({
    providedIn: 'root'
})
export class DataServiceService {
  public items: Observable<Item[]>;

  users: Observable<User[]>;
  docRef: any;
  userPromise: Promise<any>;

  constructor(public afs: AngularFirestore, public authService: AuthService) {
    this.items = this.afs.collection('users').valueChanges();
  }

  getItems() {
    return this.items;
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  getUserWithUid(uid) {
    this.docRef = this.afs.doc(`users/${uid}`);
    if (this.docRef) {
      return this.userPromise = this.docRef.get().toPromise().then(doc => {
        if (doc.exists) {
          return doc.data();
        }
      });
    }
  }

  /*getUserNamesWithUids(uidList) {
    this.docRef = this.afs.doc(`users/`);
    if (this.docRef) {
      return this.userPromise = this.docRef.get().toPromise().then(doc => {
        if (doc.exists) {
          console.log(doc.data());
        }
      });
    }
  }*/
}

