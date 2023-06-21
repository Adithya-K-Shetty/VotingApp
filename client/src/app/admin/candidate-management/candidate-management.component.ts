import { Component, OnInit } from '@angular/core';
import { Candidate } from 'src/app/_models/candidate';
import { AdminService } from 'src/app/_services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CandidatesService } from 'src/app/_services/candidates.service';

@Component({
  selector: 'app-candidate-management',
  templateUrl: './candidate-management.component.html',
  styleUrls: ['./candidate-management.component.css'],
})
export class CandidateManagementComponent implements OnInit {
  allCandidates: Candidate[] = [];
  voteDate = 21;
  delete_disable = false;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private router: Router,
    private candidateService: CandidatesService
  ) {
    if (this.voteDate == new Date().getDate()) {
      this.delete_disable = true;
    }
  }

  ngOnInit(): void {
    this.getAllCandidates();
  }

  getAllCandidates() {
    console.log('Hello');
    this.adminService.getAllCandidates().subscribe({
      next: (candidates) => (this.allCandidates = candidates),
    });
  }

  deleteCandidate(candidate: Candidate) {
    const params = {
      regionCode: candidate.district + '-' + candidate.gramPanchayat,
      partyName: candidate.partyName,
    };
    this.candidateService.deleteCandidate(params).subscribe({
      next: (_) => {
        this.toastr.success('Successfully Removed');
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['admin']);
          });
      },
    });
  }
}
