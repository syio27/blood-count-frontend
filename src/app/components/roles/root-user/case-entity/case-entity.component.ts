import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-case-entity',
  templateUrl: './case-entity.component.html',
  styleUrls: ['./case-entity.component.css']
})
export class CaseEntityComponent {
  form: FormGroup;
  parameterForm: FormGroup;
  addedValues = [];
  genderDropdownOptions: string[] = ['Male', 'Female', 'Other'];
  selectedGenderOption: string = '';
  genderDropdownOpen: boolean = false;
  showSecondRangeForm: boolean = false;

  levelTypeDropdownOptions: string[] = ['Option 1', 'Option 2', 'Option 3'];
  selectedLevelTypeOption: string = '';
  levelTypeDropdownOpen: boolean = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      'anemia-type': ['', Validators.required],
      'diagnosis': ['', Validators.required],
      'first-min': ['', Validators.required],
      'first-max': ['', Validators.required],
      'second-min': [''],
      'second-max': ['']
    });

    this.parameterForm = this.fb.group({
      parameter: [''],
      'parameter-min': [''],
      'parameter-max': ['']
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

  addValue() {
    let id = this.addedValues.length;
    const parameter = this.parameterForm.get('parameter').value;
    const minAge = this.parameterForm.get('parameter-min').value;
    const maxAge = this.parameterForm.get('parameter-max').value;
    const levelType = this.selectedLevelTypeOption;

    if (!parameter || !minAge || !maxAge || !levelType) {
      return; 
    }

    this.addedValues.push({ id ,parameter, minAge, maxAge, levelType });

    this.parameterForm.reset();
    this.selectedLevelTypeOption = '';
  }


  removeValue(index: number) {
    this.addedValues.splice(index, 1);
  }
}
