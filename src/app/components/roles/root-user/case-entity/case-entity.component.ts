import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaseService } from 'src/app/services/case.service';
import { ICreateCaseRequest } from 'src/app/interfaces/ICreateCaseRequest';
import { ICreateAbnormalityRequest } from 'src/app/interfaces/ICreateAbnormalityRequest';
import { AffectedGenders } from 'src/app/enums/affectedGender.enum';
import { LevelTypes } from 'src/app/enums/levelType.enum';
import { addAbnormality, removeAbnormality } from 'src/app/store/actions/abnormalities.action';
import { Store } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup'
import { CaseDataService } from 'src/app/services/caseData.service';


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
  selectedGenderOption = '';
  genderDropdownOpen = false;
  showSecondRangeForm = false;

  levelTypeDropdownOptions = Object.values(LevelTypes);
  selectedLevelTypeOption = '';
  levelTypeDropdownOpen = false;

  constructor(
    private fb: FormBuilder,
    private caseService: CaseService,
    private store: Store,
    private toast: NgToastService,
    private caseDataService: CaseDataService

  ) {
    this.form = this.fb.group({
      'anemia-type': ['', Validators.required],
      'diagnosis': ['', Validators.required],
      'first-min': ['', Validators.required],
      'first-max': ['', Validators.required],
      'second-min': [''],
      'second-max': [''],
    });
    this.parameterForm = this.fb.group({
      'parameter': [''],
      'parameter-min': [''],
      'parameter-max': [''],
      'unit': ['']
    });
  }

  ngOnInit() {
    this.restoreFormValues();
  }


  restoreFormValues() {
    this.form.get('anemia-type').setValue(sessionStorage.getItem('anemia-type'))
    this.form.get('diagnosis').setValue(sessionStorage.getItem('diagnosis'))

    this.form.get('first-min').setValue(sessionStorage.getItem('first-min'));
    this.form.get('first-max').setValue(sessionStorage.getItem('first-max'));
    this.showSecondRangeForm ? this.form.get('second-min').setValue(null) : this.form.get('second-min').setValue(sessionStorage.getItem('second-min'))
    this.showSecondRangeForm ? this.form.get('second-max').setValue(null) : this.form.get('second-max').setValue(sessionStorage.getItem('second-max'))
    this.parameterForm.get('parameter').setValue(sessionStorage.getItem('parameter'))
    this.parameterForm.get('unit').setValue(sessionStorage.getItem('unit'))

    this.parameterForm.get('parameter-min').setValue(sessionStorage.getItem('parameter-min'));
    this.parameterForm.get('parameter-max').setValue(sessionStorage.getItem('parameter-max'));

    const storedAddedValues = sessionStorage.getItem('addedValues');
    if (storedAddedValues) {
      this.addedValues = JSON.parse(storedAddedValues);
    }

    const storedShowSecondRangeForm = sessionStorage.getItem('showSecondRangeForm');
    if (storedShowSecondRangeForm) {
      this.showSecondRangeForm = JSON.parse(storedShowSecondRangeForm);
    }

    const storedSelectedGenderOption = sessionStorage.getItem('selectedGenderOption');
    if (storedSelectedGenderOption) {
      this.selectedGenderOption = storedSelectedGenderOption;
    }

    const storedSelectedLevelTypeOption = sessionStorage.getItem('selectedLevelTypeOption');
    if (storedSelectedLevelTypeOption) {
      this.selectedLevelTypeOption = storedSelectedLevelTypeOption;
    }
  }

  saveFormValues(input) {
    switch (input) {
      case 1:
        sessionStorage.setItem('anemia-type', this.form.get('anemia-type').value);
        break;
      case 2:
        sessionStorage.setItem('diagnosis', this.form.get('diagnosis').value);
        break;
      case 3:
        sessionStorage.setItem('first-min', this.form.get('first-min').value);
        break;
      case 4:
        sessionStorage.setItem('first-max', this.form.get('first-max').value);
        break;
      case 5:
        sessionStorage.setItem('second-min', this.form.get('second-min').value);
        break;
      case 6:
        sessionStorage.setItem('second-max', this.form.get('second-max').value);
        break;
      case 7:
        sessionStorage.setItem('parameter', this.parameterForm.get('parameter').value);
        break;
      case 8:
        sessionStorage.setItem('parameter-min', this.parameterForm.get('parameter-min').value);
        break;
      case 9:
        sessionStorage.setItem('parameter-max', this.parameterForm.get('parameter-max').value);
        break;
      case 10:
        sessionStorage.setItem('unit', this.parameterForm.get('unit').value);

    }
  }



  toggleGenderDropdown() {
    this.genderDropdownOpen = !this.genderDropdownOpen;
  }

  selectGenderOption(option: string) {
    this.selectedGenderOption = option;
    this.genderDropdownOpen = false;
    sessionStorage.setItem('selectedGenderOption', option);
  }

  addSecondRangeForm() {
    this.showSecondRangeForm = true;
    sessionStorage.setItem('showSecondRangeForm', JSON.stringify(this.showSecondRangeForm));
  }

  removeSecondRangeForm() {
    this.showSecondRangeForm = false;
    sessionStorage.setItem('showSecondRangeForm', JSON.stringify(this.showSecondRangeForm));
  }

  toggleLevelTypeDropdown() {
    this.levelTypeDropdownOpen = !this.levelTypeDropdownOpen;
  }

  selectLevelTypeOption(option: string) {
    this.selectedLevelTypeOption = option;
    this.levelTypeDropdownOpen = false;
    sessionStorage.setItem('selectedLevelTypeOption', option);
  }

  removeValue(parameter) {
    const index = this.addedValues.findIndex(item => item === parameter);
    if (index !== -1) {
      this.addedValues.splice(index, 1);
      sessionStorage.setItem('addedValues', JSON.stringify(this.addedValues));
    }
    this.store.dispatch(removeAbnormality({ parameter }));
  }

  addValue() {
    const parameter = this.parameterForm.get('parameter').value;
    const unit = this.parameterForm.get('unit').value;
    const minAge = this.parameterForm.get('parameter-min').value;
    const maxAge = this.parameterForm.get('parameter-max').value;
    const levelType = this.selectedLevelTypeOption;

    if (!parameter || !minAge || !maxAge || !levelType || !unit) {
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
    sessionStorage.setItem('addedValues', JSON.stringify(this.addedValues));
    sessionStorage.removeItem('parameter')
    sessionStorage.removeItem('parameter-min')
    sessionStorage.removeItem('unit')
    sessionStorage.removeItem('parameter-max')
    sessionStorage.removeItem('selectedLevelTypeOption')
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
    this.caseService.createCaseWithAbnormality(caseData, this.addedValues).subscribe(
      () => {
        console.log('Case creation successful');
        this.selectedGenderOption = '';
        this.parameterForm.reset();
        this.form.reset();
        this.selectedLevelTypeOption = '';
        sessionStorage.setItem('anemia-type', '');
        sessionStorage.setItem('diagnosis', '');
        sessionStorage.removeItem('first-min');
        sessionStorage.removeItem('first-max');
        sessionStorage.removeItem('second-min');
        sessionStorage.removeItem('second-max');
        sessionStorage.removeItem('selectedGenderOption');
        sessionStorage.removeItem('showSecondRangeForm');
        sessionStorage.removeItem('addedValues');
        sessionStorage.setItem('parameter', '')
        sessionStorage.removeItem('parameter-min')
        sessionStorage.removeItem('unit')
        sessionStorage.removeItem('parameter-max')
        sessionStorage.removeItem('selectedLevelTypeOption')
        this.addedValues.splice(0, this.addedValues.length);
        sessionStorage.setItem('addedValues', JSON.stringify(this.addedValues));
        this.toast.success({ detail: "Operation done successfully", summary: 'Case has been created', duration: 2000 });
        this.caseDataService.refreshTable();
      },
      (error: HttpErrorResponse) => {
        console.error('An error occurred during case creation:', error);
        console.log('HTTP Status Code:', error.status);
        this.toast.error({ detail: "Error", summary: error.message, duration: 2000 });
      })
  }
}
