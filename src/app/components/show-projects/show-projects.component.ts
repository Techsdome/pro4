import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import * as firebase from 'firebase';
import {Posts} from '../../shared/services/posts';
import {AngularFirestore} from '@angular/fire/firestore';
import {ReactionsService} from '../../services/reactions.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-show-projects',
  templateUrl: './show-projects.component.html',
  styleUrls: ['./show-projects.component.css']
})
export class ShowProjectsComponent implements OnInit {

  @Input() allPostsObject: Posts;

  user: any;
  comments: any[] = [];
  edit = false;
  comment: string;
  showCommentSection = false;
  commentsLenght: number;
  posts: any[] = [];
  filter: boolean;

  emojiList: string[];
  reactionCount: any;
  userReaction: any;
  subscription: Posts;

  headMessage: string;

  constructor(public authservice: AuthService,
              public afs: AngularFirestore,
              private reactionSvc: ReactionsService
             ) { }

  openCommentSection() {
    document.getElementById('comment-inputfield').focus();
    this.showCommentSection = !this.showCommentSection;
  }

  openComment() {
    this.edit = !this.edit;
    this.showCommentSection = !this.showCommentSection;
  }

  addComment() {
    if (this.comment) {
      const date: Date = new Date();

      this.authservice.getCurrentUser().subscribe((result) => {
        this.authservice.afs.collection('users').doc(result.uid).valueChanges()
          .subscribe((val: any) => {
            this.comments.push({
              comment: this.comment,
              commentName: val.firstname + ' ' + val.lastname,
              date: date.toLocaleString('en-GB'),
            });

            this.authservice.afs.doc(`mainFeed/allPosts/post/${this.allPostsObject.postId}`).collection('comments').add({
              comment: this.comment,
              commentName: val.firstname + ' ' + val.lastname,
              date: date.toLocaleString('en-GB'),
            });
          });
      });
      this.comment = '';
    }
  }

/*  updateLikes(): void {
    this.likes++;

    this.afs.doc(`mainFeed/allPosts/post/${this.allPostsObject.postId}`).update({
      likes: firebase.firestore.FieldValue.increment(1)
    }).then(() => {
      this.loadPost();
    });
  }*/

  loadPost() {
    let postType;

    this.afs.doc(`mainFeed/allPosts/post/${this.allPostsObject.postId}`).get().toPromise().then(doc => {
      if (doc.exists) {
        postType = doc.data().postType;
        this.loadReactions().then(r => { });
      }

    }).then(() => {
      switch (postType) {
        case 'project':
          this.headMessage = 'created a Project';
          break;
        case 'question':
          this.headMessage = 'asked a Question';
          break;
        case 'post':
          this.headMessage = 'posted';
          break;
        default:
          this.headMessage = 'posted';
          break;
      }
    });


    this.authservice.afs.collection(`mainFeed/allPosts/post/${this.allPostsObject.postId}/comments`).get().toPromise().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.comments.push(doc.data());
      });
    }).then(() => {
      const array = this.comments.sort(this.sortAfterDate);
    });
  }

  formatDate(date) {
    return new Date(Date.parse(date)).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  }

  sortAfterDate(a, b) {
    let date1;
    let date2;

    if (a.date && b.date) {

      date1 = Date.parse(a.date);
      date2 = Date.parse(b.date);

      if (date1 && date2) {
        if (date1 > date2) {
          return 1;
        }
        if (date1 < date2) {
          return -1;
        }
        return 0;
      }
    }
  }


  ngOnInit(): void {
    this.loadPost();
  }

  async loadReactions() {
    this.emojiList = this.reactionSvc.emojiList;
    this.subscription = await this.reactionSvc.getReactions(this.allPostsObject.postId);
    this.reactionCount = this.reactionSvc.countRactions(this.subscription.likes);
    this.userReaction = this.reactionSvc.userReaction(this.subscription.likes);
  }

  hasReactions(index) {
    return _.get(this.reactionCount, index.toString());
  }

  react(val) {
    if (this.userReaction === val) {
      this.reactionSvc.removeReaction(this.allPostsObject.postId);
    } else {
      this.reactionSvc.updateReactions(this.allPostsObject.postId, val);
    }
  }

  toggle() {
    this.filter = !this.filter;
  }
}
