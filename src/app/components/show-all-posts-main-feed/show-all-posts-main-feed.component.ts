import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';

@Component({
    selector: 'app-show-all-posts-main-feed',
    templateUrl: './show-all-posts-main-feed.component.html',
    styleUrls: ['./show-all-posts-main-feed.component.css']
})
export class ShowAllPostsMainFeedComponent implements OnInit {
    user: any;
    posts: any = [];
    photoURL: string;

    constructor(public authservice: AuthService) {
    }

    ngOnInit(): void {
        this.authservice.getCurrentUser().subscribe((result) => {
            this.user = result;
            this.photoURL = result.photoURL;
            this.authservice.afs.collection('generalPosts').doc(result.uid)
                .collection('posts').valueChanges()
                .subscribe((val) => {
                    this.posts = [];
                    val.sort((t1, t2) => {
                        const year1 = t1.year;
                        const year2 = t2.year;
                        const month1 = t1.month;
                        const month2 = t2.month;
                        const day1 = t1.day;
                        const day2 = t2.day;
                        const hour1 = t1.hour;
                        const hour2 = t2.hour;
                        const minutes1 = t1.minutes;
                        const minutes2 = t2.minutes;
                        const second1 = t1.second;
                        const second2 = t2.second;
                        if (year1 === year2
                            && month1 === month2
                            && day1 === day2
                            && hour1 === hour2
                            && minutes1 === minutes2) {
                            return second2 - second1;
                        } else if (year1 === year2
                            && month1 === month2
                            && day1 === day2
                            && hour1 === hour2
                            && minutes1 !== minutes2) {
                            return minutes2 - minutes1;
                        } else if (year1 === year2
                            && month1 === month2
                            && day1 === day2
                            && hour1 !== hour2
                            && minutes1 !== minutes2) {
                            return hour2 - hour1;
                        } else if (year1 === year2
                            && month1 === month2
                            && day1 !== day2
                            && hour1 !== hour2
                            && minutes1 !== minutes2) {
                            return day2 - day1;
                        } else if (year1 === year2
                            && month1 !== month2
                            && day1 !== day2
                            && hour1 !== hour2
                            && minutes1 !== minutes2) {
                            return month2 - month1;
                        } else {
                            return year2 - year1;
                        }
                    });
                    val.forEach((value) => {
                        const postObject = {
                            postDate: value.date,
                            postText: value.post,
                            postHour: value.hour,
                            postMinutes: value.minutes,
                            postSecond: value.second,
                            photoURL: value.photoURL,
                            displayName: value.displayName
                        };
                        this.posts.push(postObject);
                    });
                });
        });
    }
}
