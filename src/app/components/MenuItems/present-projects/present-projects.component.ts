import {Component, ViewChild, ElementRef, OnInit, AfterViewInit} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {User} from '../../../shared/services/user';
import {AuthService} from '../../../shared/services/auth.service';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { ProjectBubble } from '../../../classes/project-bubble'

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
              public authService: AuthService) {
  }


  createProjectBubbles(){
    let innerHTML_bubble = " ";
    let bubble_container = document.getElementById('bubble_container') as HTMLInputElement;

    this.projectBubble.forEach(element => {
      innerHTML_bubble += element.htmlRenderer();
      console.log(innerHTML_bubble);
    });

    bubble_container.innerHTML = innerHTML_bubble;

    const main_bubble_container = Array.from(document.getElementsByClassName('main_bubble_container'));
      for (const item of main_bubble_container) {
      const item_cast = <HTMLElement> item;
      item_cast.style.position = "relative"
    }
    
    const members_img = Array.from(document.getElementsByClassName('members_img'));
      for (const item of members_img) {
      const item_cast = <HTMLElement> item;
      item_cast.style.position = "absolute"
      item_cast.addEventListener('mouseover',()=>{
        item_cast.style.cursor = "pointer";
      });
    }

    const main_bubble_img = Array.from(document.getElementsByClassName('main_bubble_img'));
      for (const item of main_bubble_img) {
      const item_cast = <HTMLElement> item;
      item_cast.addEventListener('mouseover',()=>{
        item_cast.style.transform = "scale(1.1)";
        item_cast.style.cursor = "pointer";
      });
      item_cast.addEventListener('mouseleave',()=>{
        item_cast.style.transform = "scale(1.0)";
      });
      item_cast.style.transition = "0.2s"
    }

  }

  checkTarget(){
    let offset = 50;
    this.canvas.nativeElement.addEventListener('mousemove', (e)=>{
      this.projectBubble.forEach(element => {
        if(e.x - offset > (element.getX() - element.getWidth()) &&
          e.x - offset < (element.getX() + element.getWidth()) &&
          e.y - offset > (element.getY() - element.getWidth()) &&
          e.y - offset < (element.getY() + element.getWidth())){  
            this.canvas.nativeElement.style.cursor="pointer";
        }
        else this.canvas.nativeElement.style.cursor="default";
      });
    });
  }


  resize(canvas) {
    this.canvas.nativeElement.width  = window.innerWidth*2;
    this.canvas.nativeElement.height = window.innerHeight*4;
    this.createProjectBubbles();
   }

  ngOnInit(): void {

    this.regler.nativeElement.addEventListener('input', ()=>{
      this.zoomValue = Number(this.regler.nativeElement.value);
      this.projectBubble.forEach(element => {
        this.canvas.nativeElement.style.transform = 'scale(' + this.zoomValue/100 + ')';
      });
    });

    window.addEventListener('mousedown', (e)=>{
      if(this.regler.nativeElement != e.target){
        this.canvasIsClicked = true;
        this.mouseClickedX = e.x;
        this.mouseClickedY = e.y;
      }
    });

    window.addEventListener('mouseup', ()=>{
      this.canvasIsClicked = false;
    });

    window.addEventListener('mousemove', (e)=>{
      if(this.canvasIsClicked){
        this.canvas.nativeElement.style.cursor="move";
        this.mouseMoveX = this.mouseClickedX - e.x;
        this.mouseMoveY = this.mouseClickedY - e.y;
        this.canvasMarginLeft += -(this.mouseMoveX)/15;
        this.canvasMarginTop += -(this.mouseMoveY)/15;
        this.canvas.nativeElement.style.marginLeft = this.canvasMarginLeft  + "px";
        this.canvas.nativeElement.style.marginTop = this.canvasMarginTop  + "px";
      }
    });

    

    this.ctx = this.canvas.nativeElement.getContext('2d');
    window.addEventListener('resize', ()=>{
      this.resize(this.canvas);
    });
    this.resize(this.canvas);

    this.checkTarget();

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
                    let randomX = (Math.random()*window.innerWidth) + window.innerWidth/2;
                    let randomY = (Math.random()*window.innerHeight) + window.innerHeight/2;        
                    
                    let bubble = new ProjectBubble(this.ctx,
                      randomX,
                      randomY,
                      posts.projectName,
                      posts.projectBanner,
                      posts.postId,
                      this.authService
                      );
                    bubble.setTags(posts.projectCategories);
                    bubble.setMembers(posts.projectMembers);
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
