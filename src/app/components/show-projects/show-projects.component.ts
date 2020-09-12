import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
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
  posts: any[] = [];
  filter: boolean;

  emojiList: string[];
  reactionCount = {};
  userReaction: any;

  headMessage: string;

  constructor(private authservice: AuthService,
              private afs: AngularFirestore,
              private reactionSvc: ReactionsService
             ) { }

  ngOnInit(): void {
    this.emojiList = this.reactionSvc.emojiList;
    this.afs.doc(`mainFeed/allPosts/post/${this.allPostsObject.postId}`).valueChanges().subscribe((reactions: Posts) => {
      this.reactionCount = this.reactionSvc.countRactions(reactions.likes);
      this.userReaction = this.reactionSvc.userReaction(reactions.likes);
    });

    this.loadPost();
  }

  toggle() {
    this.filter = !this.filter;
  }

  loadPost() {
    let postType;

    this.afs.doc(`mainFeed/allPosts/post/${this.allPostsObject.postId}`).get().toPromise().then(doc => {
      if (doc.exists) {
        postType = doc.data().postType;
      }
    }).then(() => {
      switch (postType) {
        case 'project':
          this.headMessage = 'created a Project:';
          break;
        case 'question':
          this.headMessage = 'asked a Question:';
          break;
        case 'post':
          this.headMessage = 'posted:';
          break;
        default:
          this.headMessage = 'posted:';
          break;
      }
    });

    this.authservice.afs.collection(`mainFeed/allPosts/post/${this.allPostsObject.postId}/comments`).get().toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.comments.push(doc.data());
        });
      }).then(() => {
      const array = this.comments.sort(this.sortAfterDate);
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

  /**
   *
   *  ----------- COMMENT SECTION -----------
   */

  openCommentSection() {
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
              date: date.toString(),
            });

            this.authservice.afs.doc(`mainFeed/allPosts/post/${this.allPostsObject.postId}`).collection('comments').add({
              comment: this.comment,
              commentName: val.firstname + ' ' + val.lastname,
              date: date.toString(),
            });
            this.comment = '';
          });
      });
    }
  }

  formatDate(date) {
    return new Date(Date.parse(date)).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   *
   *  ----------- REACTION SECTION -----------
   */

  /**
   * Get reaction list of database
   */
  async loadReactions() {

  }

  /**
   *
   * @param index - return the string of the reaction
   * Currently not in use.
   */
  hasReactions(index) {
    return _.get(this.reactionCount, index.toString());
  }

  /**
   *
   * @param val - reaction of the user
   * Currently only likes possible.
   */
  react(val) {
    this.reactionSvc.getReactions(this.allPostsObject.postId);
    if (this.userReaction === val) {
      this.reactionSvc.removeReaction(this.allPostsObject.postId, this.allPostsObject.uid);
    } else {
        this.reactionSvc.updateReactions(this.allPostsObject.postId, val);
    }
  }
}
