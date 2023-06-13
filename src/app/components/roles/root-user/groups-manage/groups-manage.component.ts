import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../../../services/group.service';
import { IGroupResponse } from '../../../../interfaces/IGroupResponse';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICreateGroupRequest } from 'src/app/interfaces/ICreateGroupRequest';
import { GroupType } from 'src/app/enums/groupType.enum';

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
  groupTypeDropdownOpen = false;
  selectedGroupTypeOption = null;
  groupTypeDropdownOptions = Object.values(GroupType);


  constructor(
    private groupService: GroupService,
    private fb: FormBuilder,
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

          this.fetchGroups();
        },
        (error) => {
          console.error('Failed to create group:', error);
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
      }
    );
  }
}
