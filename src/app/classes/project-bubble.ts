export class ProjectBubble {

    constructor(private ctx: CanvasRenderingContext2D, private x:number, private y:number ,private name: string, private banner) {}
    private width = 75;
    private zoomWidth = this.width;
    private members: string[] = [];
    private tags: string[] = [];
    membersPositions = [[0,-this.width*1.6],[this.width*1.13,-this.width*1.13],[this.width*1.6,0],[this.width*1.13,this.width*1.13],[0,this.width*1.6],[-this.width*1.13,this.width*1.13],[-this.width*1.6,0],[-this.width*1.13,-this.width*1.13]]

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
