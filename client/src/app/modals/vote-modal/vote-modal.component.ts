import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-vote-modal',
  templateUrl: './vote-modal.component.html',
  styleUrls: ['./vote-modal.component.css'],
})
export class VoteModalComponent implements OnInit {
  candidateName = '';
  partyName = '';
  region = '';
  confirmed = false;
  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {}
  confirmVote() {
    this.confirmed = true;
    this.bsModalRef.hide();
  }
}
