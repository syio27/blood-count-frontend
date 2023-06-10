import { Component, OnInit } from '@angular/core';
import { Roles } from '../../../../enums/role.enum';
import { UserDetails } from 'src/app/interfaces/IUserDetails';
import { AdminService } from 'src/app/services/administration.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent implements OnInit {
  Roles = Roles;
  currentCategory = Roles.Student;
  tableData: any[] = [];

  constructor(private adminService: AdminService) { }

  changeCategory(role: Roles) {
    this.currentCategory = role;
    this.fetchTableData(role);
  }

  ngOnInit() {
    this.fetchTableData(this.currentCategory);
  }

  private fetchTableData(role: Roles) {
    this.adminService.fetchUsersByRole(role).subscribe(
      (userDetails: UserDetails[]) => {
        this.tableData = userDetails.map(user => {
          return {
            email: user.email,
            groupNumber: user.groupNumber,
            role: user.role
          };
        });
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
}
