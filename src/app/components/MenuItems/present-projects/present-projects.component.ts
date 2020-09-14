import {Component, ViewChild, ElementRef, OnInit, AfterViewInit} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {User} from '../../../shared/services/user';
import {AuthService} from '../../../shared/services/auth.service';
import { ProjectBubble } from '../../../classes/project-bubble'
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-present-projects',
  templateUrl: './present-projects.component.html',
  styleUrls: ['./present-projects.component.css']
})


export class PresentProjectsComponent implements OnInit {

  @ViewChild('canvas', { static: true }) 
  canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('regler', { static: true }) 
  regler: ElementRef<HTMLInputElement>;

  private ctx: CanvasRenderingContext2D;

  projects: any[] = [];
  user: User;
  loading = true;
  projectBubble: ProjectBubble[] = [];
  that = this;
  zoomValue:number = 0;
  canvasIsClicked: boolean = false;
  mouseClickedX: number = 0;
  mouseClickedY: number = 0;
  mouseMoveX: number = 0;
  mouseMoveY: number = 0;
  canvasMarginLeft: number = 0;
  canvasMarginTop: number = 0;
  

  constructor(public storage: AngularFireStorage, public afs: AngularFirestore,
              public authService: AuthService,
              private router: Router) {
  }


  createProjectBubbles(){
    let innerHTML_bubble = " ";
    let bubble_container = document.getElementById('bubble_container') as HTMLInputElement;

    this.projectBubble.forEach(element => {
      innerHTML_bubble += element.htmlRenderer();
    });

    bubble_container.innerHTML = innerHTML_bubble;
    this.openContributer();
  }

  openContributer(){
    const members_img = Array.from(document.getElementsByClassName('members_img'));
      for (const item of members_img) {
      const item_cast = <HTMLElement> item;
      item_cast.addEventListener('click',()=>{
        this.router.navigate(['/app-user-profile/' + item_cast.id], { state: { profile_id_meber: item_cast.id } });
        //openPost.componentInstance.type = type;
      });
    }
  }

  ngOnInit(): void {
    /*
    [routerLink]="['/project-page', allPostsObject.postId]"
[state]="{data: allPostsObject.postId}"

    */

    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.authService.getCurrentUser().subscribe(user => {
      this.authService.afs.collection('users').doc(user.uid)
        .valueChanges()
        .subscribe((val) => {
          const myuser = val as User;
          if (myuser.pid) {
            myuser.pid.forEach((projectID) => {
              this.authService.afs.collection('mainFeed').doc('allPosts').collection('post').valueChanges().subscribe((doc) => {
                doc.forEach((posts) => {
                  if (posts.postId === projectID) {
                    this.projects.push({
                      postText: posts.postText,
                      postId: posts.postId,
                      projectName: posts.projectName,
                      projectBanner: posts.projectBanner,
                      projectMembers: posts.projectMembers
                    });

                    let bubble = new ProjectBubble(this.ctx, posts);
                    this.projectBubble.push(bubble);
                    this.createProjectBubbles();
                  }
                });
              });
            });
          }
          this.loading = false;
        });
    })
  }
}
