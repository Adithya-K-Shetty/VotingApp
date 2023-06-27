import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import {
  AbstractControl,
  ControlContainer,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter(); //emits to the parent
  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();
  validationErrors: string[] | undefined;
  District: any = ['Kasaragod', 'Kannur'];
  GramPanchayat: any = [];
  kasaragoadGramPanchayat = ['Mangalapady', 'Manjewswaram'];
  kannurGramPanchayat = ['Udayagiri', 'Chirrakal'];
  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.intializeForm(event);
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  intializeForm(e: any) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      userEmailId: ['', Validators.required],
      voterIdNumber: ['', Validators.required],
      district: ['', Validators.required],
      gramPanchayat: ['', Validators.required],
      pass: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(8)],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          this.matchValues('pass'), //check whether confirm password matches with password
        ],
      ],
    });
    this.registerForm.controls['pass'].valueChanges.subscribe({
      next: () =>
        this.registerForm.controls['confirmPassword'].updateValueAndValidity(),
    });
  }

  changeCity(e: any) {
    this.registerForm.controls['district']?.setValue(e.target.value.slice(3), {
      onlySelf: true,
    });
    if (e.target.value.slice(3) == 'Kasaragod') {
      this.GramPanchayat = [...this.kasaragoadGramPanchayat];
    } else if (e.target.value.slice(3) == 'Kannur') {
      this.GramPanchayat = [...this.kannurGramPanchayat];
    }
  }

  changePanchayat(e: any) {
    this.registerForm.controls['gramPanchayat']?.setValue(
      e.target.value.slice(3),
      {
        onlySelf: true,
      }
    );
  }

  get cityName() {
    return this.registerForm.get('district');
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value
        ? null
        : { notMatching: true };
    };
  }

  register() {
    console.log('Hello');
    const dob = this.getDateOnly(
      this.registerForm.controls['dateOfBirth'].value
    );
    const values = { ...this.registerForm.value, dateOfBirth: dob };
    console.log(values);
    this.accountService.register(values).subscribe({
      next: () => {
        //this.router.navigateByUrl('/candidates');
        this.toastr.info(
          'Your Account Will Be Activated Soon And Will Be Notified Via Mail'
        );
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['']);
          });
        this.cancle();
      },
      error: (error) => {
        this.validationErrors = error;
      },
    });
  }
  cancle() {
    this.cancelRegister.emit(false);
  }

  private getDateOnly(dob: string | undefined) {
    if (!dob) return;

    let theDob = new Date(dob);
    return new Date(
      theDob.setMinutes(theDob.getMinutes() - theDob.getTimezoneOffset())
    )
      .toISOString()
      .slice(0, 10);
  }
}
