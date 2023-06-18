import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  user: User | undefined;
  allusers: User[] = [];
  bsModalRef: BsModalRef<RolesModalComponent> =
    new BsModalRef<RolesModalComponent>(); //creating a reference to the roles-modal component
  availableRoles = ['Admin', 'Moderator', 'Member'];

  constructor(
    private adminService: AdminService,
    private modalSevice: BsModalService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.getUsersWithRoles();
    this.getAllUsers();
  }

  // getUsersWithRoles() {
  //   this.adminService.getUsersWithRoles().subscribe({
  //     next: (users) => (this.users = users),
  //   });
  // }

  getAllUsers() {
    console.log('Hello');
    this.adminService.getAllUsers().subscribe({
      next: (allusers) => (this.allusers = allusers),
    });
  }

  allowUser(user: User) {
    const params = {
      userName: user.username,
      voterIdNumber: user.voterIdNumber,
    };
    this.adminService.allowUser(params).subscribe({
      next: (response: any) => {
        if (response.loginAllowed) this.toastr.success('Approved User');
        else this.toastr.warning('Disapproved User');
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['admin']);
          });
      },
    });
  }

  // openRolesModal(user: User) {
  //   const config = {
  //     class: 'modal-dialog-centered',
  //     initialState: {
  //       username: user.username,
  //       availableRoles: this.availableRoles,
  //       selectedRoles: [...user.roles],
  //     },
  //   };
  //   this.bsModalRef = this.modalSevice.show(RolesModalComponent, config);
  //   this.bsModalRef.onHide?.subscribe({
  //     next: () => {
  //       const selectedRoles = this.bsModalRef.content?.selectedRoles;
  //       if (!this.arrayEqual(selectedRoles!, user.roles)) {
  //         this.adminService
  //           .updateUserRoles(user.username, selectedRoles!)
  //           .subscribe({
  //             next: (roles) => (user.roles = roles),
  //           });
  //       }
  //     },
  //   });
  // }
  // private arrayEqual(arr1: any[], arr2: any[]) {
  //   return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  // }
}
