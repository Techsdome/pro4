import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent implements OnInit {

  @Input() src: string;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    const modalImage = document.getElementById('img');
    modalImage.setAttribute('src', this.src);
    modalImage.setAttribute('height', '100%');
  }

}
