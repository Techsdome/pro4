import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import * as _ from 'lodash';

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

  async getReactions(itemId) {
    this.docRef = this.afs.doc(`mainFeed/allPosts/post/${itemId}`);
    if (this.docRef) {
      return this.reactionPromise = this.docRef.get().toPromise().then(doc => {
        if (doc.exists) {
          this.likeList = doc.data().likes;
          return doc.data();
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

  removeReaction(itemId) {
    console.log(itemId);
    console.log(this.likeList);
    const index = this.likeList.findIndex(x => x === itemId);
    console.log(index);
    if (index >= 0) {
      this.likeList.splice(index, 1);
    }
  }

  countRactions(reactions) {
    return _.mapValues(_.groupBy(reactions), 'length');
  }

  userReaction(reactions) {
    return _.get(reactions, this.userId);
  }
}
