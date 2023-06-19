import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addcandidate-management',
  templateUrl: './addcandidate-management.component.html',
  styleUrls: ['./addcandidate-management.component.css'],
})
export class AddcandidateManagementComponent implements OnInit {
  model = {
    candidateName: '',
    partyName: '',
    district: '',
    gramPanchayat: '',
    regionCode: '',
    voteCount: 0,
  };
  gramPanchayatOptions: string[] = [];
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user: User | undefined;
  constructor(private accoutService: AccountService, private router: Router) {
    this.accoutService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
        }
      },
    });
  }

  ngOnInit(): void {
    this.intializeUploader();
  }
  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
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

  submitCandidate() {
    this.model.regionCode =
      this.model.district + '-' + this.model.gramPanchayat;
    console.log(this.model);
  }
  intializeUploader() {
    console.log(this.model);
    this.uploader = new FileUploader({
      url: this.baseUrl + 'candidates/add-candidate',
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
      method: 'POST',
    });

    this.uploader.onAfterAddingFile = (file) => {
      console.log(this.model);
      file.withCredentials = false;
    };

    this.uploader.onBuildItemForm = (fileItem, form) => {
      form.append('candidateName', this.model.candidateName);
      form.append('partyName', this.model.partyName);
      form.append('district', this.model.district);
      form.append('gramPanchayat', this.model.gramPanchayat);
      form.append(
        'regionCode',
        this.model.district + '-' + this.model.gramPanchayat
      );
      form.append('voteCount', this.model.voteCount);
      // form.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        console.log(JSON.parse(response));
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['admin']);
          });
        // const photo = JSON.parse(response);
        // if (this.user) {
        //   this.user.documentUrl = photo.documentUrl;
        //   this.accoutService.setCurrentUser(this.user);
        // }
      }
    };
  }
}
