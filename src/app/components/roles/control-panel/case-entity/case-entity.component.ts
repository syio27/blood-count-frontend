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
import { ReferenceTableService } from 'src/app/services/reference-table.service';
import { Subscription } from 'rxjs';
import { IReferenceTable } from 'src/app/interfaces/IReferenceTable';
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

  parameterDropdownOptions: any[];
  selectedParameterOption = '';
  parameterDropdownOpen = false;
  referenceTableSubscription: Subscription;

  unitDropdownOptions: any[];
  selectedUnitOption = '';
  unitDropdownOpen = false;

  constructor(
    private fb: FormBuilder,
    private caseService: CaseService,
    private store: Store,
    private toast: NgToastService,
    private caseDataService: CaseDataService,
    private referanceTable: ReferenceTableService

  ) {
    this.form = this.fb.group({
      'anemia-type': ['', Validators.required],
      'diagnosis': ['', Validators.required],
      'details': ['', Validators.required],
      'first-min': ['', Validators.required],
      'first-max': ['', Validators.required],
      'second-min': [''],
      'second-max': [''],
    });
    this.parameterForm = this.fb.group({
      'parameter-min': [''],
      'parameter-max': [''],
    });
  }

  ngOnInit() {
    this.restoreFormValues();
    this.referenceTableSubscription = this.referanceTable.fetchBCReferenceTable().subscribe(data => {
      this.parameterDropdownOptions = [data].flatMap((subArray) => subArray).map(data => data.parameter).filter((value, index, self) => self.indexOf(value) === index);
      this.unitDropdownOptions = [data].flatMap((subArray) => subArray).map(data => data.unit).filter((value, index, self) => self.indexOf(value) === index);
      console.log(this.unitDropdownOptions)
    });

  }


  restoreFormValues() {
    this.form.get('anemia-type').setValue(sessionStorage.getItem('anemia-type'))
    this.form.get('diagnosis').setValue(sessionStorage.getItem('diagnosis'))

    this.form.get('first-min').setValue(sessionStorage.getItem('first-min'));
    this.form.get('first-max').setValue(sessionStorage.getItem('first-max'));
    this.form.get('details').setValue(sessionStorage.getItem('details'));

    this.showSecondRangeForm ? this.form.get('second-min').setValue(null) : this.form.get('second-min').setValue(sessionStorage.getItem('second-min'))
    this.showSecondRangeForm ? this.form.get('second-max').setValue(null) : this.form.get('second-max').setValue(sessionStorage.getItem('second-max'))

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
    const storedSelectedParameterOption = sessionStorage.getItem('selectedParameterOption');
    if (storedSelectedParameterOption) {
      this.selectedParameterOption = storedSelectedParameterOption;
    }
    const storedSelectedUnitOption = sessionStorage.getItem('selectedUnitOption');
    if (storedSelectedUnitOption) {
      this.selectedUnitOption = storedSelectedUnitOption;
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
      case 8:
        sessionStorage.setItem('parameter-min', this.parameterForm.get('parameter-min').value);
        break;
      case 9:
        sessionStorage.setItem('parameter-max', this.parameterForm.get('parameter-max').value);
        break;
      case 10:
        sessionStorage.setItem('details', this.form.get('details').value);
        break;
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
  toggleParameterDropdown() {
    this.parameterDropdownOpen = !this.parameterDropdownOpen;
  }
  toggleUnitDropdown() {
    this.unitDropdownOpen = !this.unitDropdownOpen;
  }
  selectLevelTypeOption(option: string) {
    this.selectedLevelTypeOption = option;
    this.levelTypeDropdownOpen = false;
    sessionStorage.setItem('selectedLevelTypeOption', option);
  }

  selectParameterOption(option: string) {
    this.selectedParameterOption = option;
    this.parameterDropdownOpen = false;
    sessionStorage.setItem('selectedParameterOption', option);
  }
  selectUnitOption(option: string) {
    this.selectedUnitOption = option;
    this.unitDropdownOpen = false;
    sessionStorage.setItem('selectedUnitOption', option);
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
    const parameter = this.selectedParameterOption
    const unit = this.selectedUnitOption
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
    this.selectedParameterOption = '';
    this.selectedUnitOption = '';
    sessionStorage.setItem('addedValues', JSON.stringify(this.addedValues));
    sessionStorage.removeItem('parameter-min')
    sessionStorage.removeItem('parameter-max')
    sessionStorage.removeItem('selectedUnitOption')
    sessionStorage.removeItem('selectedLevelTypeOption')
    sessionStorage.removeItem('selectedParameterOption')

  }

  createCaseWithAbnormality() {
    const caseData: ICreateCaseRequest = {
      anemiaType: this.form.get('anemia-type').value,
      diagnosis: this.form.get('diagnosis').value,
      //details: this.form.get('details').value,
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
        this.selectedParameterOption = '';
        this.selectedUnitOption = '';
        sessionStorage.setItem('anemia-type', '');
        sessionStorage.setItem('diagnosis', '');
        sessionStorage.setItem('details', '');

        sessionStorage.removeItem('first-min');
        sessionStorage.removeItem('first-max');
        sessionStorage.removeItem('second-min');
        sessionStorage.removeItem('second-max');
        sessionStorage.removeItem('selectedGenderOption');
        sessionStorage.removeItem('showSecondRangeForm');
        sessionStorage.removeItem('addedValues');
        sessionStorage.removeItem('parameter-min')
        sessionStorage.removeItem('unit')
        sessionStorage.removeItem('parameter-max')
        sessionStorage.removeItem('selectedLevelTypeOption')
        sessionStorage.removeItem('selectedParameterOption')
        sessionStorage.removeItem('selectedUnitOption')
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
