import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form_controls: any = {
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  };
  form_is_valid = false;

  constructor(
    private router: Router,
    private service: AuthService,
    private snackBar: MatSnackBar) {

      // check if is already login
      if(this.service.is_login()) {
        this.router.navigate(['admin/user']);
      }
    }

  ngOnInit() {
  }
  
  onInput() {

    // set form valid flag
    if(this.form_controls.email.valid
      && this.form_controls.password.valid) {
      this.form_is_valid = true;
    }
    else {
      this.form_is_valid = false;
    }
  }

  async onSubmit() {

    if(!this.form_is_valid) {
      return;
    }

    // http request
    const response = await this.service.login({
      email: this.form_controls.email.value,
      password: this.form_controls.password.value,
    });

    // check if has error
    if (response.error) {
      this.openSnackBar(response.error);
    } else {
      // reset value
      this.form_controls.email.setValue('');
      this.form_controls.password.setValue('');

      // reser validation
      this.form_controls.email.setErrors(null);
      this.form_controls.password.setErrors(null);

      // redirect to admin/user
      this.router.navigate(['admin/user']);
    }
  }

  // Error SnackBar
  openSnackBar(error: string) {
    this.snackBar.open(error, 'OK', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  onRegister() {
    this.router.navigate(['registration']);
  }

}
