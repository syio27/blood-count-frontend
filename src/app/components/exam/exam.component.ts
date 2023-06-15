import { Component, OnInit } from '@angular/core';
import { ReferenceTableService } from '../../services/reference-table.service';
import { IReferenceTable } from '../../interfaces/IReferenceTable';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit{
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
  get displayedElements(): IReferenceTable[] {
    return this.cbcData.slice(0, 8);
  }
  get displayedElements2(): IReferenceTable[] {
    return this.cbcData.slice(8, 20);
  }
}
