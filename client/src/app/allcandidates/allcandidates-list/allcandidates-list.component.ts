import { Component, OnInit } from '@angular/core';
import { Candidate } from 'src/app/_models/candidate';
import { CandidatesService } from 'src/app/_services/candidates.service';
import { Pagination } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/userParams';
import { CandidateParams } from 'src/app/_models/candidateParams';

@Component({
  selector: 'app-allcandidates-list',
  templateUrl: './allcandidates-list.component.html',
  styleUrls: ['./allcandidates-list.component.css'],
})
export class AllcandidatesListComponent implements OnInit {
  pagination: Pagination | undefined;
  candidateParams: CandidateParams | undefined;
  allcandidates: Candidate[] = [];
  model = {
    district: '',
    gramPanchayat: '',
  };
  gramPanchayatOptions: string[] = [];
  constructor(private candidateService: CandidatesService) {
    this.candidateParams = this.candidateService.getCandidateParams();
  }

  ngOnInit(): void {
    this.loadAllCandidates();
  }

  onDistrictChange() {
    if (this.model.district === 'Kasaragod') {
      this.gramPanchayatOptions = ['Mangalapady', 'Manjewswaram'];
    } else if (this.model.district === 'Kannur') {
      this.gramPanchayatOptions = ['Udayagiri', 'Chirrakal'];
    } else {
      this.gramPanchayatOptions = [];
    }
  }

  loadAllCandidates() {
    if (this.candidateParams) {
      this.candidateService.setCandidateParams(this.candidateParams);
      this.candidateService.getAllCandidates(this.candidateParams).subscribe({
        next: (response) => {
          if (response.result && response.pagination) {
            this.allcandidates = response.result;
            this.pagination = response.pagination;
          }
        },
      });
    }

    // this.candidateService.getAllCandidates().subscribe({
    //   next: (allcandidates) => (this.allcandidates = allcandidates),
    // });
  }

  pageChanged(event: any) {
    if (!this.candidateParams) return;
    if (this.candidateParams.pageNumber !== event.page) {
      this.candidateParams.pageNumber = event.page;
      this.candidateService.setCandidateParams(this.candidateParams);
      this.loadAllCandidates();
    }
  }

  /**testing */
  FilterCandidates() {
    if (this.model.district == '' || this.model.gramPanchayat == '') {
      this.loadAllCandidates();
      return;
    }
    const params = {
      district: this.model.district,
      gramPanchayat: this.model.gramPanchayat,
      // Add more query parameters as needed
    };
    this.candidateService.getCandidates(params).subscribe({
      next: (candidates) => (this.allcandidates = candidates),
    });
    // console.log(this.candidates);
  }
}
