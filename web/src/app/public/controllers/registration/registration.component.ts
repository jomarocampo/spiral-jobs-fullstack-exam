import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  form_controls: any = {
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirm_password: new FormControl('', [Validators.required]),
  };
  form_is_valid = false;
  is_registered = false;

  constructor(
    private router: Router,
    private service: AuthService,
    private snackBar: MatSnackBar) {}

  ngOnInit() {
  }
  
  onInput(input='') {
    
    // Check if confirm password is not match to password
    if(input === 'confirm_password') {
      if(this.form_controls.confirm_password 
        && this.form_controls.password.value !== this.form_controls.confirm_password.value) {
        this.form_controls.confirm_password.setErrors({'not_match': true});
      }
      else {
        this.form_controls.confirm_password.setErrors(null);
      }
    }

    // set form valid flag
    if(this.form_controls.name.valid
      && this.form_controls.email.valid
      && this.form_controls.password.valid
      && this.form_controls.confirm_password.valid) {
      this.form_is_valid = true;
    }
    else {
      this.form_is_valid = false;
    }
  }

  onCancel() {
    this.router.navigate(['login']);
  }

  async onSubmit() {

    if(!this.form_is_valid) {
      return;
    }

    // http request
    const response = await this.service.register({
      name: this.form_controls.name.value,
      email: this.form_controls.email.value,
      password: this.form_controls.password.value,
      confirm_password: this.form_controls.confirm_password.value,
    });

    // check if has error
    if (response.error) {
      this.openSnackBar(response.error);
    } else {
      // reset value
      this.form_controls.name.setValue('');
      this.form_controls.email.setValue('');
      this.form_controls.password.setValue('');
      this.form_controls.confirm_password.setValue('');

      // reser validation
      this.form_controls.name.setErrors(null);
      this.form_controls.email.setErrors(null);
      this.form_controls.password.setErrors(null);
      this.form_controls.confirm_password.setErrors(null);

      // show success message for 2 seconds
      this.is_registered = true;
      setTimeout(() => {
        this.is_registered = false;
      }, 5000);
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

}
