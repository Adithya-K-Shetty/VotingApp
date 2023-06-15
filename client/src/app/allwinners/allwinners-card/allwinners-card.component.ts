import { Component, Input, OnInit } from '@angular/core';
import { Candidate } from 'src/app/_models/candidate';

@Component({
  selector: 'app-allwinners-card',
  templateUrl: './allwinners-card.component.html',
  styleUrls: ['./allwinners-card.component.css'],
})
export class AllwinnersCardComponent implements OnInit {
  @Input() winner: Candidate | undefined;
  constructor() {}

  ngOnInit(): void {}
  changeImage(event: MouseEvent): void {
    const wrapper = event.target as HTMLDivElement;
    const img = wrapper.querySelector('img') as HTMLImageElement;

    // Change the image source on hover
    if (this.winner) img.src = this.winner?.photoUrl;
  }

  resetImage(event: MouseEvent): void {
    const wrapper = event.target as HTMLDivElement;
    const img = wrapper.querySelector('img') as HTMLImageElement;

    // Reset the image source on mouseleave
    if (this.winner) img.src = './assets/' + this.winner.partyName + '.png';
  }
}
