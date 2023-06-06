import { Component, OnInit } from '@angular/core';
import { ReferenceTableService } from '../../services/reference-table.service';
import { IReferenceTable } from '../../interfaces/IReferenceTable';

@Component({
  selector: 'app-cbc-table',
  templateUrl: './cbc-table.component.html',
  styleUrls: ['./cbc-table.component.css']
})
export class CbcTableComponent implements OnInit {
  cbcData: IReferenceTable[] = [];

  constructor(private referenceTableService: ReferenceTableService) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.referenceTableService.fetchBCReferenceTable().subscribe(
      (data) => {
        this.cbcData = [data].flatMap((subArray) => subArray); 
      },
      (error) => {
        console.error('Failed to fetch data:', error);
      }
    );
  }

}
