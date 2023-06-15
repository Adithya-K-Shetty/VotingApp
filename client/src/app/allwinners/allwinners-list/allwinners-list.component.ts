import { Component, OnInit } from '@angular/core';
import { Candidate } from 'src/app/_models/candidate';
import { CandidatesService } from 'src/app/_services/candidates.service';

@Component({
  selector: 'app-allwinners-list',
  templateUrl: './allwinners-list.component.html',
  styleUrls: ['./allwinners-list.component.css'],
})
export class AllwinnersListComponent implements OnInit {
  allwinners: Candidate[] = [];
  constructor(private candidateService: CandidatesService) {}

  ngOnInit(): void {
    this.loadAllWinners();
  }

  loadAllWinners() {
    this.candidateService.getAllWinners().subscribe({
      next: (allwinners) => (this.allwinners = allwinners),
    });
  }
}
