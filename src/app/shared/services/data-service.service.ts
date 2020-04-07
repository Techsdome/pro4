import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Item} from '../../models/Item';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class DataServiceService {
    public items: Observable<Item[]>;

    constructor(public afs: AngularFirestore, public authService: AuthService) {
        this.items = this.afs.collection('users').valueChanges();
    }


    getItems() {
        return this.items;
    }

    getCurrentUser() {
        return this.authService.getCurrentUser();
    }
}

