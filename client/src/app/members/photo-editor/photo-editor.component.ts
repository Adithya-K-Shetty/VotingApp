import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Photo } from 'src/app/_models/photo';
import { User } from 'src/app/_models/user';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css'],
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member | undefined;
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user: User | undefined;

  constructor(
    private accoutService: AccountService,
    private memberService: MembersService,
    private router: Router
  ) {
    this.accoutService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
        }
      },
    });
  }

  ngOnInit(): void {
    console.log(this.baseUrl);
    this.intializeUploader();
  }

  //for drop zone base
  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  //setting the photo as main photo
  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe({
      next: () => {
        if (this.user && this.member) {
          this.user.photoUrl = photo.url;
          this.accoutService.setCurrentUser(this.user);
          this.member.photoUrl = photo.url;
          this.member.photos.forEach((p) => {
            if (p.isMain) p.isMain = false;
            if (p.id === photo.id) p.isMain = true;
          });
        }
      },
    });
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        if (this.member) {
          this.member.photos = this.member.photos.filter(
            (x) => x.id !== photoId
          );
        }
      },
    });
  }

  //this is outside the angular Http Request
  //thats why we providing the auth token
  /*intializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true, //after uploading it to api we just discard the image
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });
    //after adding file event
    this.uploader.onAfterAddingFile = (file) => {
      // file upload process does not require credentials, and the server is not configured to expect them
      file.withCredentials = false; //else we have to adjust cors configuration
    };
    //after successful upload
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        this.member?.photos.push(photo);
        if (photo.isMain && this.user && this.member) {
          this.user.photoUrl = photo.url;
          this.member.photoUrl = photo.url;
          this.accoutService.setCurrentUser(this.user);
        }
      }
    };
  }*/

  intializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-document',
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true, //after uploading it to api we just discard the image
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
      method: 'PUT',
    });
    this.uploader.onAfterAddingFile = (file) => {
      // file upload process does not require credentials, and the server is not configured to expect them
      file.withCredentials = false; //else we have to adjust cors configuration
    };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        console.log(JSON.parse(response));
        const photo = JSON.parse(response);
        //this.user?.documents.push(photo);

        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['member/edit']);
          });
        /*if (this.user) {
          // this.user?.documents.push(photo);
          this.user.documentUrl = photo.documentUrl;
          this.accoutService.setCurrentUser(this.user);
        }*/

        // this.router
        //   .navigateByUrl('/', { skipLocationChange: true })
        //   .then(() => {
        //     this.router.navigate(['member/edit']);
        //   });
        // if (photo.isMain && this.user && this.member) {
        //   this.user.photoUrl = photo.url;
        //   this.member.photoUrl = photo.url;
        //   this.accoutService.setCurrentUser(this.user);
        // }
      }
    };
  }
}
