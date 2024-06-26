import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Candidate } from 'src/app/_models/candidate';
import { User } from 'src/app/_models/user';
import { CandidatesService } from 'src/app/_services/candidates.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { VoteModalComponent } from 'src/app/modals/vote-modal/vote-modal.component';

@Component({
  selector: 'app-candidate-card',
  templateUrl: './candidate-card.component.html',
  styleUrls: ['./candidate-card.component.css'],
})
export class CandidateCardComponent implements OnInit {
  @Input() candidate: Candidate | undefined;
  user: User | undefined;
  disableBtn = false;
  //disableBtn = false;
  votedate = '26-6-2023';
  bsModalRef: BsModalRef<VoteModalComponent> =
    new BsModalRef<VoteModalComponent>();

  constructor(
    private toastr: ToastrService,
    private candidateService: CandidatesService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private modalSevice: BsModalService
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
      //this.disableBtn = this.user.hasVoted;
    }
    if (date_string == this.votedate && (currentHour < 6 || currentHour > 18)) {
      this.disableBtn = false;
    }
  }

  ngOnInit(): void {}

  castVote(candidate: Candidate) {
    const params = {
      regionCode: candidate.district + '-' + candidate.gramPanchayat,
      partyName: candidate.partyName,
    };
    /**testing modal */
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        candidateName: candidate.candidateName,
        partyName: candidate.partyName,
        region: candidate.district + '-' + candidate.gramPanchayat,
      },
    };

    this.bsModalRef = this.modalSevice.show(VoteModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef.content?.confirmed) {
          this.candidateService.casteVote(params).subscribe({
            next: () => {
              this.toastr.success('Successfully Voted');
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
      },
    });
    /**end of testing */
    // this.candidateService.casteVote(params).subscribe({
    //   next: () => {
    //     this.toastr.success('Successfully Voted');
    //     const userString = localStorage.getItem('user');
    //     console.log(userString);
    //     if (!userString) return;
    //     this.user = JSON.parse(userString);
    //     if (this.user && this.user.hasVoted) {
    //       this.disableBtn = this.user.hasVoted;
    //       this.router
    //         .navigateByUrl('/', { skipLocationChange: true })
    //         .then(() => {
    //           this.router.navigate(['/candidates']);
    //         });
    //     }
    //   },
    // });
  }

  /*--------Testing----------------*/
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
  /*--------EndOfTesting----------*/
}
