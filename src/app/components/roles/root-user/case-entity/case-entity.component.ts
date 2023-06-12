import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaseService } from 'src/app/services/case.service';
import { ICreateCaseRequest } from 'src/app/interfaces/ICreateCaseRequest';
import { ICreateAbnormalityRequest } from 'src/app/interfaces/ICreateAbnormalityRequest';
import { AffectedGenders } from 'src/app/enums/affectedGender.enum';
import { LevelTypes } from 'src/app/enums/levelType.enum';
import { addAbnormality, removeAbnormality } from 'src/app/store/actions/abnormalities.action';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-case-entity',
  templateUrl: './case-entity.component.html',
  styleUrls: ['./case-entity.component.css']
})
export class CaseEntityComponent implements OnInit {
  form: FormGroup;
  parameterForm: FormGroup;
  addedValues: ICreateAbnormalityRequest[] = [];
  genderDropdownOptions = Object.values(AffectedGenders);
  selectedGenderOption: string | null = null;
  genderDropdownOpen = false;
  showSecondRangeForm = false;

  levelTypeDropdownOptions = Object.values(LevelTypes);
  selectedLevelTypeOption: string | null = null;
  levelTypeDropdownOpen = false;

  constructor(
    private fb: FormBuilder,
    private caseService: CaseService,
    private store: Store
  ) {
    this.form = this.fb.group({
      'anemia-type': ['', Validators.required],
      diagnosis: ['', Validators.required],
      'first-min': ['', Validators.required],
      'first-max': ['', Validators.required],
      'second-min': [''],
      'second-max': [''],
    });
    this.parameterForm = this.fb.group({
      parameter: [''],
      'parameter-min': [''],
      'parameter-max': ['']
    });
  }

  ngOnInit() {
    const storedValues = localStorage.getItem('addedValues');
    if (storedValues) {
      this.addedValues = JSON.parse(storedValues);
    }
    const secondForm = localStorage.getItem('showSecondRangeForm');
    if(secondForm){
      this.showSecondRangeForm = JSON.parse(secondForm)
    }
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
    localStorage.setItem('showSecondRangeForm', JSON.stringify(this.showSecondRangeForm));
  }

  removeSecondRangeForm() {
    this.showSecondRangeForm = false;
    localStorage.setItem('showSecondRangeForm', JSON.stringify(this.showSecondRangeForm));
  }

  toggleLevelTypeDropdown() {
    this.levelTypeDropdownOpen = !this.levelTypeDropdownOpen;
  }

  selectLevelTypeOption(option: string) {
    this.selectedLevelTypeOption = option;
    this.levelTypeDropdownOpen = false;
  }

  removeValue(parameter: string) {
    const index = this.addedValues.findIndex(item => item.parameter === parameter);
    if (index !== -1) {
      this.addedValues.splice(index, 1);
      localStorage.setItem('addedValues', JSON.stringify(this.addedValues));
    }
    this.store.dispatch(removeAbnormality({ parameter }));
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

    this.store.dispatch(addAbnormality({ abnormality: abnormalityData }));
    this.addedValues.push(abnormalityData);
    this.parameterForm.reset();
    this.selectedLevelTypeOption = '';

    localStorage.setItem('addedValues', JSON.stringify(this.addedValues));
  }

  createCaseWithAbnormality() {
    const caseData: ICreateCaseRequest = {
      anemiaType: this.form.get('anemia-type').value,
      diagnosis: this.form.get('diagnosis').value,
      firstMinAge: this.form.get('first-min').value,
      firstMaxAge: this.form.get('first-max').value,
      secondMinAge: this.form.get('second-min').value || 0,
      secondMaxAge: this.form.get('second-max').value || 0,
      affectedGender: this.selectedGenderOption as AffectedGenders
    };
    console.log(caseData, this.addedValues);
    this.caseService.createCaseWithAbnormality(caseData, this.addedValues);
  }
}
