import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireObject} from '@angular/fire/database';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import * as _ from 'lodash';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReactionsService {

  docRef: any;
  reactionPromise: any;
  userId: string;
  emojiList = ['like'];
  likeList = [];

  constructor( private db: AngularFireDatabase,
               private afAuth: AngularFireAuth,
               private afs: AngularFirestore
  ) {
    this.afAuth.authState.subscribe((auth) => {
      if (auth) { this.userId = auth.uid; }
    });
  }

  getReactions(itemId) {
    this.docRef = this.afs.doc(`mainFeed/allPosts/post/${itemId}`);
    if (this.docRef) {
      return this.reactionPromise = this.docRef.get().toPromise().then(doc => {
        if (doc.exists) {
          this.likeList = doc.data().likes;
        }
      });
    }
  }

  updateReactions(itemId, reaction = 0) {
    const data = { [this.userId]: reaction};
    this.afs.collection('mainFeed/allPosts/post/').doc(itemId).set({
      likes: data,
    }, {merge: true}).then(r => {

    });
  }

  removeReaction(itemId, uid) {
    const index = Object.keys(this.likeList).indexOf(uid);
    if (index >= 0) {
      delete this.likeList[uid];
    }

    this.afs.collection('mainFeed/allPosts/post/').doc(itemId).update({
      likes: this.likeList,
    }).then(r => {

    });
  }

  countRactions(reactions) {
    return _.mapValues(_.groupBy(reactions), 'length');
  }

  userReaction(reactions) {
    return _.get(reactions, this.userId);
  }
}
