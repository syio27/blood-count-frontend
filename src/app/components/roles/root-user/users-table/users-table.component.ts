
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent implements OnInit{
  currentCategory = 1;
  tableData: any[] = [];



  changeCategory(category: number) {
    this.currentCategory = category;
  }

  ngOnInit() {
    setInterval(() => {
      if (this.currentCategory === 1) {
        this.tableData = [
          { email: 'example1@gmail.com', code: '001', role: 'Admin' },
        ];
      } else if (this.currentCategory === 2) {
        this.tableData = [
          { email: 'example2@gmail.com', code: '002', role: 'User' },
        ];
      } else if (this.currentCategory === 3) {
        this.tableData = [
          { email: 'example3@gmail.com', code: '003', role: 'Guest' },
        ];
      }
    },);
  }
}
