export class ProjectBubble {

  constructor(private ctx: CanvasRenderingContext2D, private postOject) {}

  private width = 150;
  private zoomWidth = this.width;
  private tags: string[] = [];
  membersPositions = [[this.width / 3, -(this.width / 3 + 10)],
    [this.width - 20, -(this.width / 3 - 20)],
    [this.width + 10, this.width / 3],
    [this.width - 20, this.width - 20],
    [this.width / 3, this.width + 10],
    [-(this.width / 3 - 20), this.width - 20],
    [-(this.width / 3 + 10), this.width / 3],
    [-(this.width / 3 - 20), -(this.width / 3 - 20)]];

  htmlRenderer() {
    return `<div class="main_bubble_container" style="height:${this.width}px; width:${this.width}px;" >
                    <div class="main_bubble_image_container" id=${this.postOject.postId}>
                        <img class="main_bubble_img" src=${this.postOject.projectBanner} alt="altext"/>
                    </div>
                    ${this.htmlRendererMembers()}
                </div>`;
  }


  htmlRendererMembers() {
    let innerHTML = '';
    this.postOject.projectMembersPhotoURL.forEach((element, i) => {
      innerHTML += `<img class="members_img" id="${this.postOject.projectMembers[i]}" src="${this.postOject.projectMembersPhotoURL[i]}"
        style="height:${this.width / 3}px;
             width:${this.width / 3}px;
             left:${this.membersPositions[i][0]}px;
             top:${this.membersPositions[i][1]}px"/>`;
    });
    return innerHTML;
  }

  zoom(zoomValue) {
    this.width = zoomValue / 100 * this.zoomWidth;
  }


}
