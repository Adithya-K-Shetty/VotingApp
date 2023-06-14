import { Component, Input, OnInit } from '@angular/core';
import { Candidate } from 'src/app/_models/candidate';

@Component({
  selector: 'app-allcandidates-card',
  templateUrl: './allcandidates-card.component.html',
  styleUrls: ['./allcandidates-card.component.css'],
})
export class AllcandidatesCardComponent implements OnInit {
  @Input() candidate: Candidate | undefined;
  constructor() {}

  ngOnInit(): void {}
  changeImage(event: MouseEvent): void {
    const wrapper = event.target as HTMLDivElement;
    const img = wrapper.querySelector('img') as HTMLImageElement;

    // Change the image source on hover
    if (this.candidate) img.src = this.candidate?.photoUrl;
  }

  resetImage(event: MouseEvent): void {
    const wrapper = event.target as HTMLDivElement;
    const img = wrapper.querySelector('img') as HTMLImageElement;

    // Reset the image source on mouseleave
    if (this.candidate)
      img.src = './assets/' + this.candidate.partyName + '.png';
  }
}
