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
  model = {
    district: '',
    gramPanchayat: '',
  };
  gramPanchayatOptions: string[] = [];
  constructor(private candidateService: CandidatesService) {}

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
    this.candidateService.getAllCandidates().subscribe({
      next: (allcandidates) => (this.allcandidates = allcandidates),
    });
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
