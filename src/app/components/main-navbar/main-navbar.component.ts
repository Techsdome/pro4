import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {User} from '../../shared/services/user';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs';
import {switchMap, filter, map} from 'rxjs/operators';
import {DataServiceService} from '../../shared/services/data-service.service';
import {UtilitiesService} from '../../app.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {trigger, style, animate, transition} from '@angular/animations';
import {AngularFirestore} from 'angularfire2/firestore';
import {FormControl} from '@angular/forms';
import {CreatePostNewComponent} from '../create-post-new/create-post-new.component';
import {PresenceService} from '../../services/presence.service';
import {Posts} from '../../shared/services/posts';
import * as firebase from "firebase";


interface ViewedPost {
  postId: string;
  timeStamp?: any;
}

@Component({
  selector: 'app-main-navbar',
  templateUrl: './main-navbar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./main-navbar.component.css'],
  animations: [
    trigger('slide', [
      transition(':enter', [
        style({transform: 'translate(0px, 150px)'}),
        animate('1s')
      ]),
    ]),
  ]
})
export class MainNavbarComponent implements OnInit {
  public status = false;
  public menuClicked = false;
  user: User;
  photoURL: string;
  stat: string;
  myControl = new FormControl();
  results: Observable<any[]>;
  offset = new Subject<string>();
  userId: string;

  presence$;

  viewed: any[] = [];
  notificationPosts: Posts[] = [];
  notificationIds: string[] = [];
  lastTimeStamp;


  constructor(@Inject(AuthService) public authService: AuthService,
              @Inject(DataServiceService) private dataService: DataServiceService,
              private utilitiesService: UtilitiesService,
              private modalService: NgbModal,
              private afs: AngularFirestore,
              public presence: PresenceService) {
  }

  ngOnInit() {
    this.results = this.search();
    this.authService.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        this.userId = user.uid;
        this.presence$ = this.presence.getPresence(this.userId);

        this.afs.collection('users').doc(this.user.uid)
          .get().toPromise().then(
          doc => {
            if (doc.exists) {
              this.photoURL = doc.data().photoURL;
              this.afs.collection('users').doc(this.user.uid).collection('viewed').get().toPromise().then(sub => {
                if (sub.docs.length > 0) {
                  this.afs.collection(`users/${this.user.uid}/viewed`, ref => ref.orderBy('viewedTime'))
                    .snapshotChanges().subscribe((data: any) => {
                    if (data) {
                      data.map(post => {
                        this.viewed.push(post.payload.doc.data());
                      });
                      this.lastTimeStamp = this.viewed[this.viewed.length - 1].viewedTime;
                    }

                    console.log(new Date(this.lastTimeStamp.seconds * 1000));

                    this.afs.collection(`mainFeed/allPosts/post/`, ref => ref.orderBy('timeStamp').startAfter(this.lastTimeStamp))
                      .snapshotChanges().subscribe((data: any) => {
                      if (data) {
                        data.map(post => {
                          console.log(post.payload.doc.data().postId);
                          if (!this.notificationIds.includes(post.payload.doc.data().postId)) {
                            this.notificationPosts.push(post.payload.doc.data());
                            this.notificationIds.push(post.payload.doc.data().postId);
                          }
                          /*       this.viewed.forEach(a => {
                                   if (post.payload.doc.data().postId !== a.postId) {
                                     if (!this.notificationIds.includes(post.payload.doc.data().postId)) {
                                       this.notificationPosts.push(post.payload.doc.data());
                                       this.notificationIds.push(post.payload.doc.data().postId);
                                     }
                                   }
                                 });*/
                        });
                      }
                    });
                  });
                } else {
                  /*
                  * TODO: set view notification limit 3
                  *
                  * */
                  console.log('no collection');
                }
              });
            } // End if doc
          });
      } // End if user
    });
  }

  onkeyup(e) {
    this.offset.next(e.target.value.toLowerCase());
  }

  search() {
    return this.offset.pipe(
      filter(val => !!val),
      switchMap(offset => {
        return this.afs.collection('users', ref =>
          ref.orderBy(`searchableIndex.${offset}`).limit(5)
        ).valueChanges();
      })
    );
  }

  animateOn() {
    this.status = !this.status;
  }

  createNewPost(type: string) {
    const openPost = this.modalService.open(CreatePostNewComponent,
      {
        scrollable: true
      });
    openPost.componentInstance.type = type;
  }

  removeOneNotification(event) {
    const target = event.target || event.currentTarget;
    const postingId = target.attributes.id.nodeValue;

    const obj = {
      postId: postingId,
      viewedTime: firebase.firestore.Timestamp.now()
    };

    this.afs.collection(`users/${this.user.uid}/viewed`).doc(postingId).set(obj, {merge: true}).then(r => {
    });
  }

  removeAllNotification() {
    const ref = this.afs.collection(`users/${this.user.uid}/viewed`);
    this.notificationIds.forEach(id => {
      const obj = {
        postId: id,
        viewedTime: firebase.firestore.Timestamp.now()
      };
      this.afs.collection(`users/${this.user.uid}/viewed`).doc(id).set(obj, {merge: true}).then(r => {
      });
    });
  }
}
