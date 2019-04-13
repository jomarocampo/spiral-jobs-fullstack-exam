import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/public/services/auth/auth.service';
import { AuthDef } from 'src/app/public/services/auth/auth.interfaces';
import { UserListPayloadDef, UserSearchOptionsDef, UserListDataResponseDef } from './user.interfaces';
import { Subject, of } from 'rxjs';
import {debounceTime, delay, distinctUntilChanged, flatMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { MatSnackBar, MatPaginator, PageEvent } from '@angular/material';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  // token data
  user: AuthDef;

  // data for user list search
  data: UserListPayloadDef =  {
    pagination_start: 1,
    pagination_end: 5,
    filter_by: '',
    filter_value: '',
    is_deleted: false,
    order_id: '',
    order_name: '',
    order_email: '',
    order_created_by: '',
    order_created_date: '',
    is_fetching: false,
  }
  search_options: UserSearchOptionsDef[] = [
    {field: 'name', label: 'Name'},
    {field: 'email', label: 'Email'},
    {field: 'created_by', label: 'Created By'},
  ];
  search_key_up = new Subject<string>();

  // users list
  columnsToDisplay = ['id', 'name', 'email', 'created_by', 'created_date'];
  users_data: UserListDataResponseDef = {
    error: '',
    result: [],
    count: 0
  };
  page_index = 0;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private authService: AuthService,
    private service: UserService,
    private snackBar: MatSnackBar,
  ) { 
    this.user = this.authService.get_auth_data();
  }

  ngOnInit() {

    // search
    this.search_key_up
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        flatMap(e => of(e).pipe(delay(250)))
      )
      .subscribe(() => {
        this.page_index = 0;
        this.data.pagination_end = (this.data.pagination_end - this.data.pagination_start) + 1;
        this.data.pagination_start = 1;
        
        this.searchUser();
      });

      // pagination
      this.paginator.page.subscribe((pageEvent: PageEvent) => {
        this.page_index = pageEvent.pageIndex;
        this.data.pagination_start = this.page_index === 0 ? 1 : (this.page_index * pageEvent.pageSize) + 1;
        this.data.pagination_end = this.page_index === 0 ? pageEvent.pageSize : (this.data.pagination_start + pageEvent.pageSize) - 1;
        this.searchUser();
      });
  }
  
  async searchUser() {

    if(!this.data.filter_by || !this.data.filter_value) {
      return
    }

    // show loading
    this.data.is_fetching = true;

    // filter user
    this.users_data = await this.service.search(this.data) as UserListDataResponseDef;

    // hide loading
    this.data.is_fetching = false;

    // check if has error
    if (this.users_data.error) {
      this.openSnackBar(this.users_data.error);
    }

    console.log('Filter now', this.users_data.result);
  }

  async onSort(field) {
    // current sort
    const current_sort = this.data['order_'+field];

    // new sort
    let new_sort = '';
    switch (current_sort) {
      case '':
        new_sort = 'ASC'
        break
      case 'ASC':
        new_sort = 'DESC'
        break
    }

    // reset
    this.data.order_id = '';
    this.data.order_name = '';
    this.data.order_email = '';
    this.data.order_created_by = '';
    this.data.order_created_date = '';

    // sort selected
    this.data = Object.assign({}, this.data, {
      ['order_'+field]: current_sort === 'ASC' ? 'DESC' : 'ASC',
    });

    await this.searchUser();
  }

  onPaginate(a) {
    console.log(a);
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
