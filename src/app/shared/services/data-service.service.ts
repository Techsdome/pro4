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

    userscollection: AngularFirestoreCollection<User>;
    users: Observable<User[]>;

    constructor(public afs: AngularFirestore, public authService: AuthService) {
        this.items = this.afs.collection('users').valueChanges();
    }

    getItems() {
        return this.items;
    }

    getCurrentUser() {
        return this.authService.getCurrentUser();
    }

    /*getUserWithUid(uid) {
      this.users = this.userscollection.snapshotChanges().map(
        changes => {
          return changes.map(
            a => {
              const data = a.payload.doc.data() as User;
              data.id = a.payload.doc.id;
              return data;
            });

        });

      return this.users;
    }*/
}



