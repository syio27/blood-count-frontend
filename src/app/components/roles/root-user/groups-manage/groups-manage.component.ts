import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../../../services/group.service';
import { IGroupResponse } from '../../../../interfaces/IGroupResponse';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICreateGroupRequest } from 'src/app/interfaces/ICreateGroupRequest';
import { GroupType } from 'src/app/enums/groupType.enum';
import { AdminService } from 'src/app/services/administration.service';
import { UserDetails } from 'src/app/interfaces/IUserDetails';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup'

@Component({
  selector: 'app-groups-manage',
  templateUrl: './groups-manage.component.html',
  styleUrls: ['./groups-manage.component.css']
})
export class GroupsManageComponent implements OnInit {
  groups: IGroupResponse[] = [];
  form: FormGroup;
  currentPage = 1;
  groupsPerPage = 4;
  openedPopup = false
  groupTypeDropdownOpen = false;
  selectedGroupTypeOption = null;
  groupTypeDropdownOptions = Object.values(GroupType);
  groupParticipants: UserDetails[] = []
  selectedGroup: any;

  constructor(
    private groupService: GroupService,
    private fb: FormBuilder,
    private adminService: AdminService,
    private toast: NgToastService

  ) {
    this.form = this.fb.group({
      'groupName': ['', Validators.required],
    });
  }

  createGroup(): void {
    if (this.form.valid && this.selectedGroupTypeOption) {
      const groupName = this.form.get('groupName').value;
      const groupType = this.selectedGroupTypeOption;
      const groupRequest: ICreateGroupRequest = {
        groupNumber: groupName,
        groupType: groupType
      };

      this.groupService.createNewGroup(groupRequest).subscribe(
        (response) => {
          console.log('New group created:', response);

          this.form.reset();
          this.selectedGroupTypeOption = null;
          this.toast.success({detail:"Operation done successfully",summary:'Group has been created',duration: 2000});

          this.fetchGroups();
        },
        (error) => {
          console.error('Failed to create group:', error);
          this.toast.error({ detail: "Error", summary: error.message, duration: 2000 });

        }
      );
    }
  }

  toggleGroupTypeDropdown(): void {
    this.groupTypeDropdownOpen = !this.groupTypeDropdownOpen;
  }

  selectGroupTypeOption(option: GroupType): void {
    this.selectedGroupTypeOption = option;
    this.groupTypeDropdownOpen = false;
  }

  get totalPages(): number {
    return Math.ceil(this.groups.length / this.groupsPerPage);
  }

  get displayedGroups(): IGroupResponse[] {
    const startIndex = (this.currentPage - 1) * this.groupsPerPage;
    const endIndex = startIndex + this.groupsPerPage;
    return this.groups.slice(startIndex, endIndex);
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

  ngOnInit(): void {
    this.fetchGroups();
    this.groupParticipants;
  }

  fetchGroups(): void {
    this.groupService.fetchAllGroups().subscribe(
      (data) => {
        this.groups = [data].flatMap((subArray) => subArray).sort((a, b) => {
          if (a.groupType === GroupType.ADMIN_GROUP) {
            return -1;
          } else if (b.groupType === GroupType.ADMIN_GROUP) {
            return 1;
          } else {
            return 0;
          }
        });
        console.log(this.groups)
      },
      (error) => {
        console.error('Failed to fetch groups:', error);
        this.toast.error({detail:"Error",summary: error.message ,duration: 1000});

      }
    );
  }

  openPopup(item){
    this.adminService.fetchGroupParticipants(item).subscribe(
      (data)=>{
        this.groupParticipants = data
      }
    )
    this.openedPopup = true
  }
  
  closePopup(){
    this.openedPopup = false
  }

  deleteGroup(group){
    console.log(group.groupNumber)
    this.groupService.deleteGroup(group.groupNumber).subscribe(
      () => {
        this.toast.success({detail:"Operation done successfully",summary:'Group has been created',duration: 2000});
        this.openedPopup = false
        this.fetchGroups()
      },
      (error: HttpErrorResponse) => {
        console.error('An error occurred during case creation:', error);
        console.log('HTTP Status Code:', error.status);
        this.toast.error({ detail: "Error", summary: error.message, duration: 2000 });
      }
    )
  }
  deleteUserFromGroup(groupNumber, id){
    this.groupService.deleteUserFromGroup(groupNumber, id).subscribe(
      () => {
        this.toast.success({detail:"Operation done successfully",summary:'User has been deleted from the group',duration: 2000});
        this.openPopup(groupNumber)
        this.fetchGroups()
      },
      (error: HttpErrorResponse) => {
        console.error('An error occurred during case creation:', error);
        console.log('HTTP Status Code:', error.status);
        this.toast.error({ detail: "Error", summary: error.message, duration: 2000 });
      }
    )
  }
  clearGroup(group){
    this.groupService.clearGroup(group.groupNumber).subscribe(
      () => {
        this.toast.success({detail:"Operation done successfully",summary:'Group has been cleared',duration: 2000});
        this.openPopup(group.groupNumber)
        this.fetchGroups()
      },
      (error: HttpErrorResponse) => {
        console.error('An error occurred during case creation:', error);
        console.log('HTTP Status Code:', error.status);
        this.toast.error({ detail: "Error", summary: error.message, duration: 2000 });
      }
    )
  }
}
