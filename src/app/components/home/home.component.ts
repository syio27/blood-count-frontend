import { Component, OnInit } from '@angular/core';
import { CaseService } from 'src/app/services/case.service';
import { ICaseResponse } from 'src/app/interfaces/ICaseResponse';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  onClick = false;
  dropdownOptions: string[] = [];
  selectedOption = null;

  constructor(
    private caseService: CaseService
  ){}
  toggleClick() {
    this.onClick = !this.onClick;
  }

  ngOnInit(){
    this.fecthCase();
  }

  fecthCase(){
    this.caseService.getAllCasesWithAbnormalities().subscribe(
      (cases)=>{
        this.dropdownOptions = [cases].flatMap((subArray) => subArray).map(cases => cases.anemiaType);
      }
    )
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.onClick = false;
  }
  
}
