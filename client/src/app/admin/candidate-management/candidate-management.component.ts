import { Component, OnInit } from '@angular/core';
import { Candidate } from 'src/app/_models/candidate';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-candidate-management',
  templateUrl: './candidate-management.component.html',
  styleUrls: ['./candidate-management.component.css'],
})
export class CandidateManagementComponent implements OnInit {
  allCandidates: Candidate[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getAllCandidates();
  }

  getAllCandidates() {
    console.log('Hello');
    this.adminService.getAllCandidates().subscribe({
      next: (candidates) => (this.allCandidates = candidates),
    });
  }
}
