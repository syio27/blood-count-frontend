import { Component, OnInit } from '@angular/core';
import { Roles } from '../../../../enums/role.enum';
import { UserDetails } from 'src/app/interfaces/IUserDetails';
import { AdminService } from 'src/app/services/administration.service';
import { SharedUserDetailsService } from 'src/app/services/shared-user-details.service';
import { NgToastService } from 'ng-angular-popup'
import { ISimpleGameResponse } from 'src/app/interfaces/ISimpleGameResponse';
import { ExportService } from 'src/app/services/export.service';
import { saveAs } from 'file-saver';@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent implements OnInit {
  Roles = Roles;
  openedPopup = false
  currentCategory = Roles.Student;
  tableData: UserDetails[] = [];
  currentPage = 1;
  groupsPerPage = 10;
  userDetails: UserDetails;
  userHistory: ISimpleGameResponse[] = []
  currentUserEmail: string
  constructor(
    private adminService: AdminService,
    private sharedUserService: SharedUserDetailsService,
    private toast: NgToastService,
    private exportService: ExportService
    ) { }

  changeCategory(role: Roles) {
    this.currentCategory = role;
    this.fetchTableData(role);
  }

  ngOnInit() {
    this.fetchTableData(this.currentCategory);
    this.sharedUserService.getUserDetails().subscribe(userDetails => {
      this.userDetails = userDetails;
    });

  }

  
  private fetchTableData(role: Roles) {
    this.adminService.fetchUsersByRole(role).subscribe(
      (userDetails: UserDetails[]) => {
        this.tableData = userDetails.sort((a, b) => {
          if (a.groupNumber < b.groupNumber) {
            return -1;
          }
          if (a.groupNumber > b.groupNumber) {
            return 1;
          }
          return 0;
        });
        console.log(this.tableData);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  get totalPages(): number {
    return Math.ceil(this.tableData.length / this.groupsPerPage);
  }

  get displayedUsers(): UserDetails[] {
    const startIndex = (this.currentPage - 1) * this.groupsPerPage;
    const endIndex = startIndex + this.groupsPerPage;
    return this.tableData.slice(startIndex, endIndex);
  }


  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  banAdmin(){

  }
  deleteUser(id){
    this.adminService.deleteUserById(id).subscribe(
      ()=>{
        this.toast.success({detail:"Operation done successfully",summary:'User has been deleted',duration: 2000});
        this.fetchTableData(this.currentCategory);
      },
      (error) => {
        this.toast.error({ detail: "Error", summary: error.message, duration: 2000 });
      }
    )
  }
  openPopup(id, email){
    this.adminService.getCompletedGames(id).subscribe(
      (data)=>{
        this.userHistory = data
      }
    )
    this.openedPopup = true
    this.currentUserEmail = email
  }
  closePopup(){
    this.openedPopup = false
  }
  export(){
    this.exportService.exportGameStats().subscribe(data => {
      saveAs(data, `game statistics - ${new Date().toISOString()}.xlsx`);
    });
  }
}
