import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { StoreService } from 'src/core/services/store.service';
import { LoginService } from 'src/services/LoginService/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, AfterViewInit {
  formGroup = this.fb.group({
    userName: this.fb.control('', Validators.required),
    email: this.fb.control('', [
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      Validators.required,
    ]),
    passWord: this.fb.control('', Validators.required),
    confirmPassword: this.fb.control('', Validators.required),
  });

  constructor(
    private storeService: StoreService,
    private fb: FormBuilder,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    if (this.storeService.getToken()) {
      console.log(
        '%cBạn đã đăng nhập, bạn KHÔNG ĐƯỢC ở mục register!',
        'background: red; color: white'
      );
    } else {
      console.log(
        '%cBạn chưa đăng nhập - bạn ĐƯỢC PHÉP sử dụng ở Register',
        'background: red; color: white'
      );
    }
  }

  ngAfterViewInit(): void {
    (document.querySelector('.mat-typography') as HTMLElement).style.overflowY =
      'hidden';
  }

  checkRegister(): void {
    console.log(this.formGroup.value);
    if (this.formGroup.value.passWord == this.formGroup.value.confirmPassword) {
      console.log('khop');
      this.loginService
        .registerUser({
          user: {
            username: this.formGroup.value.userName,
            email: this.formGroup.value.email,
            password: this.formGroup.value.passWord,
          },
        })
        .subscribe((data) => {
          console.log(data);
        });
    }
  }
}
