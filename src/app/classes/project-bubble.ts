import {User} from '../shared/services/user';


export class ProjectBubble {

    constructor(private ctx: CanvasRenderingContext2D, 
        private x:number, 
        private y:number,
        private name: string,
        private banner,
        private id,
        private ath) {}
    private width = 150;
    private zoomWidth = this.width;
    private members: string[] = [];
    private tags: string[] = [];
    private memeberPhoto ="";
    membersPositions = [[this.width/3,-(this.width/3+10)],
                        [this.width-20,-(this.width/3-20)],
                        [this.width+10,this.width/3],
                        [this.width-20,this.width-20],
                        [this.width/3,this.width+10],
                        [-(this.width/3-20),this.width-20],
                        [-(this.width/3+10),this.width/3],
                        [-(this.width/3-20),-(this.width/3-20)]]

    draw() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "black";
        this.ctx.font = "20px Georgia";
        this.ctx.lineWidth = 10;
        this.ctx.fillStyle = "black";
        this.ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.beginPath();
        this.ctx.fillStyle = "red";
        this.ctx.textAlign = this.ctx.textAlign = 'center';
        this.ctx.fillText(this.name, this.x, this.y);
        this.ctx.fill();
        this.ctx.closePath();
        this.tags.forEach((element,i) => {
            this.ctx.beginPath();
            this.ctx.fillStyle = "red" 
            this.ctx.arc(this.x+this.membersPositions[i][0], this.y+this.membersPositions[i][1], this.width/3, 0, 2 * Math.PI, false);
            this.ctx.fill();
            this.ctx.closePath();
        });
    }


    htmlRenderer(){
        return `<div class="main_bubble_container" id=${this.id} style="height:${this.width}px; width:${this.width}px;" >
                    <div class="main_bubble_image_container">
                        <img class="main_bubble_img" src=${this.banner} alt="altext"/>
                    </div>
                    ${this.htmlRendererMembers()}
                </div>`;
    }


    htmlRendererMembers(){
        let innerHTML = "";
        let img_src;

        this.tags.forEach((element,i) => {
            innerHTML += `<img class="members_img" src="" style="height:${this.width/3}px;
             width:${this.width/3}px; 
             left:${this.membersPositions[i][0]}px; 
             top:${this.membersPositions[i][1]}px"/>`
        });

        return innerHTML;
    }

    zoom(zoomValue){
        this.width = zoomValue/100*this.zoomWidth;
        this.draw();
    }

    getX(){return this.x}

    getY(){return this.y}

    getName(){return this.name}

    getBanner(){return this.banner}

    getWidth(){return this.width}

    setMembers(members: string[]){this.members = members}

    setTags(tags: string[]){this.tags = tags}

}
