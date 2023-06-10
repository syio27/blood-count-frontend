import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaseService } from 'src/app/services/case.service';
import { ICreateCaseRequest } from 'src/app/interfaces/ICreateCaseRequest';
import { ICreateAbnormalityRequest } from 'src/app/interfaces/ICreateAbnormalityRequest';
import { AffectedGenders } from 'src/app/enums/affectedGender.enum';
import { LevelTypes } from 'src/app/enums/levelType.enum';

@Component({
  selector: 'app-case-entity',
  templateUrl: './case-entity.component.html',
  styleUrls: ['./case-entity.component.css']
})
export class CaseEntityComponent {
  form: FormGroup;
  parameterForm: FormGroup;
  addedValues = [];
  genderDropdownOptions = Object.values(AffectedGenders);
  selectedGenderOption = null;
  genderDropdownOpen: boolean = false;
  showSecondRangeForm: boolean = false;

  levelTypeDropdownOptions = Object.values(LevelTypes);
  selectedLevelTypeOption = null;
  levelTypeDropdownOpen: boolean = false;

  constructor(private fb: FormBuilder, private caseService: CaseService) {
    this.form = this.fb.group({
      'anemia-type': ['', Validators.required],
      'diagnosis': ['', Validators.required],
      'first-min': ['', Validators.required],
      'first-max': ['', Validators.required],
      'second-min': [''],
      'second-max': [''],
    });
    this.parameterForm = this.fb.group({
      'parameter': ['', Validators.required],
      'parameter-min': ['', Validators.required],
      'parameter-max': ['', Validators.required]
    });
  }

  toggleGenderDropdown() {
    this.genderDropdownOpen = !this.genderDropdownOpen;
  }

  selectGenderOption(option: string) {
    this.selectedGenderOption = option;
    this.genderDropdownOpen = false;
  }

  addSecondRangeForm() {
    this.showSecondRangeForm = true;
  }

  removeSecondRangeForm() {
    this.showSecondRangeForm = false;
  }

  toggleLevelTypeDropdown() {
    this.levelTypeDropdownOpen = !this.levelTypeDropdownOpen;
  }

  selectLevelTypeOption(option: string) {
    this.selectedLevelTypeOption = option;
    this.levelTypeDropdownOpen = false;
  }

  removeValue(parameter) {
    const index = this.addedValues.findIndex(item => item.parameter === parameter);
    if (index !== -1) {
      this.addedValues.splice(index, 1);
    }
  }

  addValue() {
    const parameter = this.parameterForm.get('parameter').value;
    const minAge = this.parameterForm.get('parameter-min').value;
    const maxAge = this.parameterForm.get('parameter-max').value;
    const levelType = this.selectedLevelTypeOption;
    const unit = '%';
  
    if (!parameter || !minAge || !maxAge || !levelType) {
      return;
    }
  
    const abnormalityData: ICreateAbnormalityRequest = {
      parameter,
      unit,
      minValue: minAge,
      maxValue: maxAge,
      type: levelType as LevelTypes
    };
  
    this.addedValues.push(abnormalityData);
  
    this.parameterForm.reset();
    this.selectedLevelTypeOption = '';
  }
  
  createCaseWithAbnormality() {
    const caseData: ICreateCaseRequest = {
      // Assign values from the form controls
      anemiaType: this.form.get('anemia-type').value,
      diagnosis: this.form.get('diagnosis').value,
      firstMinAge: this.form.get('first-min').value,
      firstMaxAge: this.form.get('first-max').value,
      secondMinAge: this.form.get('second-min').value,
      secondMaxAge: this.form.get('second-max').value,
      affectedGender: this.selectedGenderOption as AffectedGenders
    };
    console.log(caseData, this.addedValues)
    this.caseService.createCaseWithAbnormality(caseData, this.addedValues);
  }
  

}
