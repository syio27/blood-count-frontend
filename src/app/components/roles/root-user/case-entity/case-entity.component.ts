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
      'diagnosis': ['', Validators.required],
      'first-min': ['', Validators.required],
      'first-max': ['', Validators.required],
      'second-min': [''],
      'second-max': [''],
    });
    this.parameterForm = this.fb.group({
      'parameter': [''],
      'parameter-min': [''],
      'parameter-max': ['']
    });
  }


  ngOnInit() {
    this.restoreFormValues();
  }


  restoreFormValues() {
    this.form.get('anemia-type').setValue(localStorage.getItem('anemia-type'));
    this.form.get('diagnosis').setValue(localStorage.getItem('diagnosis'));
    this.form.get('first-min').setValue(localStorage.getItem('first-min'));
    this.form.get('first-max').setValue(localStorage.getItem('first-max'));
    this.showSecondRangeForm ? this.form.get('second-min').setValue(null) : this.form.get('second-min').setValue(localStorage.getItem('second-min'))
    this.showSecondRangeForm ? this.form.get('second-max').setValue(null) : this.form.get('second-max').setValue(localStorage.getItem('second-max'))
    this.parameterForm.get('parameter').setValue(localStorage.getItem('parameter'));
    this.parameterForm.get('parameter-min').setValue(localStorage.getItem('parameter-min'));
    this.parameterForm.get('parameter-max').setValue(localStorage.getItem('parameter-max'));

    const storedAddedValues = localStorage.getItem('addedValues');
    if (storedAddedValues) {
      this.addedValues = JSON.parse(storedAddedValues);
    }

    const storedShowSecondRangeForm = localStorage.getItem('showSecondRangeForm');
    if (storedShowSecondRangeForm) {
      this.showSecondRangeForm = JSON.parse(storedShowSecondRangeForm);
    }

    const storedSelectedGenderOption = localStorage.getItem('selectedGenderOption');
    if (storedSelectedGenderOption) {
      this.selectedGenderOption = storedSelectedGenderOption;
    }

    const storedSelectedLevelTypeOption = localStorage.getItem('selectedLevelTypeOption');
    if (storedSelectedLevelTypeOption) {
      this.selectedLevelTypeOption = storedSelectedLevelTypeOption;
    }
  }

  saveFormValues() {
    localStorage.setItem('anemia-type', this.form.get('anemia-type').value);
    localStorage.setItem('diagnosis', this.form.get('diagnosis').value);
    localStorage.setItem('first-min', this.form.get('first-min').value);
    localStorage.setItem('first-max', this.form.get('first-max').value);
    localStorage.setItem('second-min', this.form.get('second-min').value);
    localStorage.setItem('second-max', this.form.get('second-max').value);
    localStorage.setItem('parameter', this.parameterForm.get('parameter').value);
    localStorage.setItem('parameter-min', this.parameterForm.get('parameter-min').value);
    localStorage.setItem('parameter-max', this.parameterForm.get('parameter-max').value);
  }



  toggleGenderDropdown() {
    this.genderDropdownOpen = !this.genderDropdownOpen;
  }

  selectGenderOption(option: string) {
    this.selectedGenderOption = option;
    this.genderDropdownOpen = false;
    localStorage.setItem('selectedGenderOption', option);
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
    localStorage.setItem('selectedLevelTypeOption', option);
  }

  removeValue(parameter) {
    const index = this.addedValues.findIndex(item => item === parameter);
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
