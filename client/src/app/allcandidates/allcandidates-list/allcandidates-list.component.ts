import { Component, OnInit } from '@angular/core';
import { Candidate } from 'src/app/_models/candidate';
import { CandidatesService } from 'src/app/_services/candidates.service';

@Component({
  selector: 'app-allcandidates-list',
  templateUrl: './allcandidates-list.component.html',
  styleUrls: ['./allcandidates-list.component.css'],
})
export class AllcandidatesListComponent implements OnInit {
  allcandidates: Candidate[] = [];
  constructor(private candidateService: CandidatesService) {}

  ngOnInit(): void {
    this.loadAllCandidates();
  }
  loadAllCandidates() {
    this.candidateService.getAllCandidates().subscribe({
      next: (allcandidates) => (this.allcandidates = allcandidates),
    });
  }
}
