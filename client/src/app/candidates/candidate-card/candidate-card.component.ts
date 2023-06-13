import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Candidate } from 'src/app/_models/candidate';
import { User } from 'src/app/_models/user';
import { CandidatesService } from 'src/app/_services/candidates.service';

@Component({
  selector: 'app-candidate-card',
  templateUrl: './candidate-card.component.html',
  styleUrls: ['./candidate-card.component.css'],
})
export class CandidateCardComponent implements OnInit {
  @Input() candidate: Candidate | undefined;
  user: User | undefined;
  disableBtn = false;
  votedate = '13-6-2023';

  constructor(
    private candidateService: CandidatesService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    const newDate = new Date();
    const currentHour = newDate.getHours() + 1;
    console.log(currentHour);
    let date_string =
      newDate.getDate() +
      '-' +
      (newDate.getMonth() + 1) +
      '-' +
      newDate.getFullYear();

    if (date_string != this.votedate) {
      console.log(date_string);
      this.disableBtn = true;
    }

    const userString = localStorage.getItem('user');
    console.log(userString);
    if (!userString) return;
    this.user = JSON.parse(userString);
    if (
      this.user &&
      date_string == this.votedate &&
      currentHour >= 6 &&
      currentHour <= 18
    ) {
      this.disableBtn = this.user.hasVoted;
    }
  }

  ngOnInit(): void {}

  castVote(candidate: Candidate) {
    const params = {
      regionCode: candidate.district + '-' + candidate.gramPanchayat,
      partyName: candidate.partyName,
    };
    this.candidateService.casteVote(params).subscribe({
      next: () => {
        const userString = localStorage.getItem('user');
        console.log(userString);
        if (!userString) return;
        this.user = JSON.parse(userString);
        if (this.user && this.user.hasVoted) {
          this.disableBtn = this.user.hasVoted;
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(['/candidates']);
            });
        }
      },
    });
  }
}
