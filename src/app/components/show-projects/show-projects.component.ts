import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import * as firebase from 'firebase';
import {Project} from '../../models/Project';
import Timestamp = firebase.firestore.Timestamp;

@Component({
    selector: 'app-show-projects',
    templateUrl: './show-projects.component.html',
    styleUrls: ['./show-projects.component.css']
})
export class ShowProjectsComponent implements OnInit {

    user: any;
    posts: any[] = [];

    constructor(public authservice: AuthService) {
    }

    ngOnInit(): void {
        this.authservice.afs.collection('mainFeed').doc('allPosts').collection('post').valueChanges()
            .subscribe((val) => {
                //const parray = val as Project[];
                const parray = val;
                parray.forEach((value) => {
                    this.posts = [];
                    console.log(value);
                    let mytime = new Date();
                    let theuserid = value.uid;
                    let username = '';
                    let photoURL = '';
                    let postText = value.post;
                    let typeImage = "https://upload.wikimedia.org/wikipedia/commons/f/f3/Exclamation_mark.png";
                    if (value.postType === "project") {
                        console.log("ffffsssads");
                        mytime = ((value.projectTimeStamp) as unknown as Timestamp).toDate();
                        theuserid = value.uid;
                        username = '';
                        photoURL = '';
                        postText = value.projectDescription;
                        typeImage = "https://cdn.iconscout.com/icon/premium/png-512-thumb/project-management-2-536854.png";
                    }
                    if (value.postType === "question"){
                        typeImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/1200px-Question_mark_%28black%29.svg.png";
                    }


                    this.authservice.afs.collection('users').doc(theuserid).get().toPromise()
                        .then((userdoc) => {
                            if (userdoc.data()) {
                                const myuser = userdoc.data();
                                photoURL = myuser.photoURL;
                                username = myuser.displayName ? myuser.displayName : myuser.lastname + ' ' + myuser.firstname;
                            }
                        })
                        .then(() => {
                            const projectObject = {
                                typeImage: typeImage,
                                postDate: mytime,
                                postText: postText,
                                postId: value.projectId,
                                displayName: username ? username : 'Anonym',
                                projectName: value.projectName,
                                projectBanner: value.projectBanner,
                                projectId: value.projectId,
                                projectCategories: value.projectCategories,
                                projectMembers: value.projectMembers,
                                userPhotoURL: photoURL
                            };
                            this.posts.push(projectObject);
                            console.log(this.posts);
                        });
                });
            });
    }
}
