import {Component, Input, OnInit} from '@angular/core';
import {DataServiceService} from '../../shared/services/data-service.service';
import {AuthService} from '../../shared/services/auth.service';

@Component({
    selector: 'app-general-post',
    templateUrl: './general-post.component.html',
    styleUrls: ['./general-post.component.css']
})
export class GeneralPostComponent implements OnInit {

    edit = false;

    @Input() postMessage: string;
    @Input() postDate: string;
    @Input() postHour: string;
    @Input() postMinute: string;
    @Input() postSecond: string;
    @Input() postDisplayName: string;
    @Input() postPhotoUrl: string;
    @Input() postId: string;
    comment: string;
    allComments: {}[];
    showCommentSection = false;
    commentsLenght: number;

    constructor(private dataService: DataServiceService, private authService: AuthService) {
    }

    addComment() {
        this.authService.getCurrentUser().subscribe((result) => {
            this.authService.afs.collection('users').doc(result.uid).valueChanges()
                .subscribe((val: any) => {
                    this.authService.afs.doc(`generalPosts/allPosts/post/${this.postId}`).collection('comments').add({
                        comment: this.comment,
                        commentName: val.firstname + val.lastname
                    });
                    this.comment = '';
                });
        });
    }

    openCommentSection() {
        this.showCommentSection = !this.showCommentSection;
    }

    openComment() {
        this.edit = !this.edit;
    }

    ngOnInit(): void {
        this.authService.afs.doc(`generalPosts/allPosts/post/${this.postId}`).collection('comments').valueChanges()
            .subscribe((val) => {
                this.allComments = [];
                val.forEach((value) => {
                    const commentObject = {
                        text: value.comment,
                        name: value.commentName
                    };
                    this.allComments.push(commentObject);
                    this.commentsLenght = this.allComments.length;
                });
            });
        if (this.commentsLenght === undefined) {
            this.commentsLenght = 0;
        }
    }


}
