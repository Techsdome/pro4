import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Item} from '../../models/Item';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class DataServiceService {
    itemsCollection: AngularFirestoreCollection<Item>;
    items: Observable<Item[]>;
    myUser: AuthService;

    constructor(public afs: AngularFirestore, myUser: AuthService) {
        this.items = this.afs.collection('users').valueChanges();
        this.myUser = myUser;
        const test = this.myUser.getUserData();
        console.log(test);
    }

    getItems() {
        return this.items;
    }
}

