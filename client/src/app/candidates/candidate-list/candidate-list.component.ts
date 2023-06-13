import { Component, OnInit } from '@angular/core';
import { Candidate } from 'src/app/_models/candidate';
import { CandidateParams } from 'src/app/_models/candidateParams';
import { CandidatesService } from 'src/app/_services/candidates.service';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css'],
})
export class CandidateListComponent implements OnInit {
  candidates: Candidate[] = [];
  candidatesParams: CandidateParams | undefined;
  constructor(private candidateService: CandidatesService) {
    this.candidatesParams = this.candidateService.getCandidateParams();
  }

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates() {
    console.log(
      this.candidatesParams?.district,
      this.candidatesParams?.gramPanchayat
    );
    const params = {
      district: this.candidatesParams?.district,
      gramPanchayat: this.candidatesParams?.gramPanchayat,
      // Add more query parameters as needed
    };
    this.candidateService.getCandidates(params).subscribe({
      next: (candidates) => (this.candidates = candidates),
    });
    console.log(this.candidates);
  }
}
