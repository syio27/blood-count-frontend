import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaseService } from 'src/app/services/case.service';
import { ICreateCaseRequest } from 'src/app/interfaces/ICreateCaseRequest';
import { ICreateAbnormalityRequest } from 'src/app/interfaces/ICreateAbnormalityRequest';
import { AffectedGenders } from 'src/app/enums/affectedGender.enum';
import { LevelTypes } from 'src/app/enums/levelType.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup'
import { CaseDataService } from 'src/app/services/caseData.service';
import { ReferenceTableService } from 'src/app/services/reference-table.service';
import { Subscription } from 'rxjs';
import { AnemiaType } from 'src/app/enums/anemiaType.enum';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-case-entity',
  templateUrl: './case-entity.component.html',
  styleUrls: ['./case-entity.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CaseEntityComponent implements OnInit {
  isMobile: boolean;
  form: FormGroup;
  parameterForm: FormGroup;
  addedValues: ICreateAbnormalityRequest[] = [];
  genderDropdownOptions = Object.values(AffectedGenders);
  selectedGenderOption = '';
  genderDropdownOpen = false;
  showSecondRangeForm = false;
  selectedLanguage: string;
  caseName: string

  selectedAnemiaOption = '';
  anemiaDropdownOpen = false;
  anemiaTypesOptions = Object.values(AnemiaType)

  levelTypeDropdownOptions = []
  selectedLevelTypeOption = '';
  levelTypeDropdownOpen = false;

  parameterDropdownOptions: any[];
  selectedParameterOption = '';
  parameterDropdownOpen = false;
  referenceTableSubscription: Subscription;

  unitDropdownOptions: any[];
  selectedUnitOption = '';
  unitDropdownOpen = false;
  disabledRange: boolean
  disabledUnit: boolean
  private readonly notifier: NotifierService;

  constructor(
    private fb: FormBuilder,
    private caseService: CaseService,
    private toast: NgToastService,
    private caseDataService: CaseDataService,
    private referanceTable: ReferenceTableService,
    private breakpointObserver: BreakpointObserver,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
    this.form = this.fb.group({
      'diagnosis': ['', Validators.required],
      'case-name': ['', Validators.required],
      'hr': ['', Validators.required],
      'rr': ['', Validators.required],
      'physExam': ['', Validators.required],
      'infoCom': ['', Validators.required],
      'first-min': ['', Validators.required],
      'first-max': ['', Validators.required],
      'second-min': [''],
      'second-max': [''],
    });
    this.parameterForm = this.fb.group({
      'parameter-min': [''],
      'parameter-max': [''],
    });
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  restoreFormValues() {

    const storedSelectedAnemiaOption = sessionStorage.getItem('anemia-type');
    if (storedSelectedAnemiaOption) {
      this.selectedAnemiaOption = storedSelectedAnemiaOption;
    } 
    this.form.get('diagnosis').setValue(sessionStorage.getItem('diagnosis'))
    this.form.get('case-name').setValue(sessionStorage.getItem('case-name'))
    this.form.get('first-min').setValue(sessionStorage.getItem('first-min'));
    this.form.get('first-max').setValue(sessionStorage.getItem('first-max'));
    this.form.get('hr').setValue(sessionStorage.getItem('hr'));
    this.form.get('rr').setValue(sessionStorage.getItem('rr'));
    this.form.get('physExam').setValue(sessionStorage.getItem('physExam'));
    this.form.get('infoCom').setValue(sessionStorage.getItem('infoCom'));
    const storedShowSecondRangeForm = sessionStorage.getItem('showSecondRangeForm');
    if (storedShowSecondRangeForm) {
      this.showSecondRangeForm = JSON.parse(storedShowSecondRangeForm);
    }

    if (!this.showSecondRangeForm) {
      this.form.get('second-min').setValue(sessionStorage.setItem('second-min', ''))
      this.form.get('second-max').setValue(sessionStorage.setItem('second-max', ''))
    }
    this.form.get('second-min').setValue(sessionStorage.getItem('second-min'))
    this.form.get('second-max').setValue(sessionStorage.getItem('second-max'))

    this.parameterForm.get('parameter-min').setValue(sessionStorage.getItem('parameter-min'));
    this.parameterForm.get('parameter-max').setValue(sessionStorage.getItem('parameter-max'));

    const storedAddedValues = sessionStorage.getItem('addedValues');
    if (storedAddedValues) {
      this.addedValues = JSON.parse(storedAddedValues);
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
    if (this.selectedParameterOption == 'HGB') {
      this.selectedUnitOption = 'g/dl'
      this.disabledUnit = true
      this.disabledRange = true
      this.unitDropdownOpen = false
      this.levelTypeDropdownOptions = ['Degree 0', 'Degree I', 'Degree II', 'Degree III', 'Degree IV']
    }
    else if (this.selectedParameterOption == 'WBC' || this.selectedParameterOption == 'PLT') {
      this.selectedUnitOption = '10^9/L'
      this.disabledUnit = true
      this.unitDropdownOpen = false
      this.disabledRange = false
      this.levelTypeDropdownOptions = ['Increased', 'Normal', 'Decreased']
    }
    else if (this.selectedParameterOption == 'RBC') {
      this.selectedUnitOption = '10^12/L'
      this.disabledUnit = true
      this.unitDropdownOpen = false
      this.disabledRange = false
      this.levelTypeDropdownOptions = ['Increased', 'Normal', 'Decreased']
    }
    else if (this.selectedParameterOption == 'HCT' || this.selectedParameterOption == 'RDW_CV') {
      this.selectedUnitOption = '%'
      this.disabledUnit = true
      this.unitDropdownOpen = false
      this.disabledRange = false
      this.levelTypeDropdownOptions = ['Increased', 'Normal', 'Decreased']
    }
    else if (this.selectedParameterOption == 'MCV') {
      this.selectedUnitOption = 'fl'
      this.disabledUnit = true
      this.unitDropdownOpen = false
      this.disabledRange = true
      this.levelTypeDropdownOptions = ['Below normal', 'Above normal']
    }
    else if (this.selectedParameterOption == 'MCH') {
      this.selectedUnitOption = 'pg'
      this.disabledUnit = true
      this.unitDropdownOpen = false
      this.disabledRange = true
      this.levelTypeDropdownOptions = ['Below normal', 'Above normal']
    }
    else if (this.selectedParameterOption == 'MCHC') {
      this.selectedUnitOption = 'g/dl'
      this.disabledUnit = true
      this.unitDropdownOpen = false
      this.disabledRange = false
      this.levelTypeDropdownOptions = ['Increased', 'Normal', 'Decreased']
    }
    else if (this.selectedParameterOption == 'RDW_SD') {
      this.selectedUnitOption = 'fl'
      this.disabledUnit = true
      this.unitDropdownOpen = false
      this.disabledRange = false
      this.levelTypeDropdownOptions = ['Increased', 'Normal', 'Decreased']
    }
    else if (this.selectedParameterOption == 'NEU' || this.selectedParameterOption == 'LYM'
      || this.selectedParameterOption == 'MONO' || this.selectedParameterOption == 'EOS' || this.selectedParameterOption == 'BASO') {
      this.unitDropdownOptions = ['10^9/L', '%']
      this.disabledUnit = false
      this.disabledRange = false
      this.levelTypeDropdownOptions = ['Increased', 'Normal', 'Decreased']
    }
    else {
      this.disabledUnit = false
      this.disabledRange = false
      this.levelTypeDropdownOptions = ['Increased', 'Normal', 'Decreased']
    }
  }

  ngOnInit() {
    this.referenceTableSubscription = this.referanceTable.fetchBCReferenceTable().subscribe(data => {
      this.parameterDropdownOptions = [data].flatMap((subArray) => subArray).map(data => data.parameter).filter((value, index, self) => self.indexOf(value) === index);
      if (this.selectedParameterOption == 'NEU' || this.selectedParameterOption == 'LYM'
        || this.selectedParameterOption == 'MONO' || this.selectedParameterOption == 'EOS' || this.selectedParameterOption == 'BASO') {
        this.unitDropdownOptions = ['10^9/L', '%']
      }
      else {
        this.unitDropdownOptions = [data].flatMap((subArray) => subArray).map(data => data.unit).filter((value, index, self) => self.indexOf(value) === index);
      }
    });
    this.restoreFormValues()
  }

  saveFormValues(input) {
    switch (input) {
      case 1:
        sessionStorage.setItem('case-name', this.form.get('case-name').value);
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
        sessionStorage.setItem('hr', this.form.get('hr').value);
        break;
      case 11:
        sessionStorage.setItem('rr', this.form.get('rr').value);
        break;
      case 12:
        sessionStorage.setItem('physExam', this.form.get('physExam').value);
        break;
      case 13:
        sessionStorage.setItem('infoCom', this.form.get('infoCom').value);
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
  toggleAnemiaDropdown() {
    this.anemiaDropdownOpen = !this.anemiaDropdownOpen;
  }


  selectAnemiaOption(option: string) {
    this.selectedAnemiaOption = option;
    this.anemiaDropdownOpen = false;
    sessionStorage.setItem('anemia-type', option);
  }

  addSecondRangeForm() {
    this.showSecondRangeForm = true;
    sessionStorage.setItem('showSecondRangeForm', JSON.stringify(this.showSecondRangeForm));
    this.restoreFormValues();

  }

  removeSecondRangeForm() {
    this.showSecondRangeForm = false;
    sessionStorage.setItem('showSecondRangeForm', JSON.stringify(this.showSecondRangeForm));
    this.restoreFormValues();

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
    switch (this.selectedLevelTypeOption) {
      case 'Degree 0':
        sessionStorage.setItem('parameter-min', '11')
        sessionStorage.setItem('parameter-max', '18')
        this.restoreFormValues()
        break;
      case 'Degree I':
        sessionStorage.setItem('parameter-min', '9.5')
        sessionStorage.setItem('parameter-max', '10.9')
        this.restoreFormValues()
        break;
      case 'Degree II':
        sessionStorage.setItem('parameter-min', '8.0')
        sessionStorage.setItem('parameter-max', '9.4')
        this.restoreFormValues()
        break;
      case 'Degree III':
        sessionStorage.setItem('parameter-min', '6.5')
        sessionStorage.setItem('parameter-max', '7.9')
        this.restoreFormValues()
        break;
      case 'Degree IV':
        sessionStorage.setItem('parameter-min', '1')
        sessionStorage.setItem('parameter-max', '6.5')
        this.restoreFormValues()
        break;
    }
    if (this.selectedParameterOption == 'MCV' && this.selectedUnitOption == 'fl') {
      if (this.selectedLevelTypeOption == 'Below normal') {
        sessionStorage.setItem('parameter-min', '65')
        sessionStorage.setItem('parameter-max', '75')
        this.restoreFormValues()
      }
      else if (this.selectedLevelTypeOption == 'Above normal') {
        sessionStorage.setItem('parameter-min', '100')
        sessionStorage.setItem('parameter-max', '105')
        this.restoreFormValues()
      }
    }
    if (this.selectedParameterOption == 'MCH' && this.selectedUnitOption == 'pg') {
      if (this.selectedLevelTypeOption == 'Below normal') {
        sessionStorage.setItem('parameter-min', '23')
        sessionStorage.setItem('parameter-max', '26')
        this.restoreFormValues()
      }
      else if (this.selectedLevelTypeOption == 'Above normal') {
        sessionStorage.setItem('parameter-min', '32')
        sessionStorage.setItem('parameter-max', '35')
        this.restoreFormValues()
      }
    }
  }

  selectParameterOption(option: string) {
    this.selectedParameterOption = option;
    this.parameterDropdownOpen = false;
    sessionStorage.setItem('parameter-min', '')
    sessionStorage.setItem('parameter-max', '')
    sessionStorage.setItem('selectedParameterOption', option);
    if (this.selectedParameterOption == 'HGB') {
      this.selectedUnitOption = 'g/dl'
      this.disabledUnit = true
      this.unitDropdownOpen = false
      this.disabledRange = true
      this.levelTypeDropdownOptions = ['Degree 0', 'Degree I', 'Degree II', 'Degree III', 'Degree IV']
      this.selectedLevelTypeOption = '';
      sessionStorage.setItem('selectedLevelTypeOption', '');
      this.restoreFormValues()
    }
    else if (this.selectedParameterOption == 'WBC' || this.selectedParameterOption == 'PLT') {
      this.selectedUnitOption = '10^9/L'
      this.disabledUnit = true
      this.unitDropdownOpen = false
      this.selectedLevelTypeOption = '';
      sessionStorage.setItem('selectedLevelTypeOption', '');
      this.restoreFormValues()
    }
    else if (this.selectedParameterOption == 'RBC') {
      this.selectedUnitOption = '10^12/L'
      this.disabledUnit = true
      this.unitDropdownOpen = false
      this.selectedLevelTypeOption = '';
      sessionStorage.setItem('selectedLevelTypeOption', '');
      this.restoreFormValues()
    }
    else if (this.selectedParameterOption == 'HCT') {
      this.selectedUnitOption = '%'
      this.disabledUnit = true
      this.unitDropdownOpen = false
      this.selectedLevelTypeOption = '';
      sessionStorage.setItem('selectedLevelTypeOption', '');
      this.restoreFormValues()
    }
    else if (this.selectedParameterOption == 'MCH') {
      this.selectedUnitOption = 'pg'
      this.disabledUnit = true
      this.unitDropdownOpen = false
      this.levelTypeDropdownOptions = ['Below normal', 'Above normal']
      this.selectedLevelTypeOption = '';
      sessionStorage.setItem('selectedLevelTypeOption', '');
      this.restoreFormValues()
    }
    else if (this.selectedParameterOption == 'MCV') {
      this.selectedUnitOption = 'fl'
      this.disabledUnit = true
      this.unitDropdownOpen = false
      this.levelTypeDropdownOptions = ['Below normal', 'Above normal']
      this.selectedLevelTypeOption = '';
      sessionStorage.setItem('selectedLevelTypeOption', '');
      this.restoreFormValues()
    }
    else if (this.selectedParameterOption == 'NEU' || this.selectedParameterOption == 'LYM'
      || this.selectedParameterOption == 'MONO' || this.selectedParameterOption == 'EOS' || this.selectedParameterOption == 'BASO') {
      this.unitDropdownOptions = ['10^9/L', '%']
      this.selectedUnitOption = ''
      this.restoreFormValues()
    }
    else {
      this.disabledUnit = false
      this.disabledRange = false
      this.levelTypeDropdownOptions = ['INCREASED', 'NORMAL', 'DECREASED']
      this.selectedLevelTypeOption = '';
      sessionStorage.setItem('selectedLevelTypeOption', '');
      this.restoreFormValues()
    }
  }

  selectUnitOption(option: string) {
    this.selectedUnitOption = option;
    this.unitDropdownOpen = false;
    sessionStorage.setItem('parameter-min', '')
    sessionStorage.setItem('parameter-max', '')
    sessionStorage.setItem('selectedUnitOption', option);
    if (this.selectedParameterOption == 'MCH' && this.selectedUnitOption == 'pg') {
      this.disabledRange = true
      this.levelTypeDropdownOptions = ['Below normal', 'Above normal']
      this.selectedLevelTypeOption = '';
      sessionStorage.setItem('selectedLevelTypeOption', '');
      this.restoreFormValues()
    }
    else if (this.selectedParameterOption == 'MCV' && this.selectedUnitOption == 'fl') {
      this.disabledRange = true
      this.levelTypeDropdownOptions = ['Below normal', 'Above normal']
      this.selectedLevelTypeOption = '';
      sessionStorage.setItem('selectedLevelTypeOption', '');
      this.restoreFormValues()
    }
    else {
      this.disabledRange = false
      this.disabledUnit = false
      this.levelTypeDropdownOptions = ['INCREASED', 'NORMAL', 'DECREASED']
      this.selectedLevelTypeOption = '';
      sessionStorage.setItem('selectedLevelTypeOption', '');
      this.restoreFormValues()
    }
  }

  removeValue(parameter) {
    const index = this.addedValues.findIndex(item => item === parameter);
    if (index !== -1) {
      this.addedValues.splice(index, 1);
      sessionStorage.setItem('addedValues', JSON.stringify(this.addedValues));
    }
  }

  addValue() {
    const parameter = this.selectedParameterOption
    const unit = this.selectedUnitOption
    const minAge = this.parameterForm.get('parameter-min').value;
    const maxAge = this.parameterForm.get('parameter-max').value;
    const levelType = this.mapLevelTypeOption(this.selectedLevelTypeOption);

    if (!parameter || !minAge || !maxAge || !levelType || !unit) {
      return;
    }

    const abnormalityData: ICreateAbnormalityRequest = {
      parameter,
      unit,
      minValue: minAge,
      maxValue: maxAge,
      type: levelType
    };


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
      anemiaType: this.selectedAnemiaOption as AnemiaType,
      diagnosis: this.form.get('diagnosis').value,
      caseName: this.form.get('case-name').value,
      firstMinAge: this.form.get('first-min').value,
      firstMaxAge: this.form.get('first-max').value,
      secondMinAge: this.form.get('second-min').value || 0,
      secondMaxAge: this.form.get('second-max').value || 0,
      affectedGender: this.selectedGenderOption as AffectedGenders,
      hr: this.form.get('hr').value,
      rr: this.form.get('rr').value,
      physExam: this.form.get('physExam').value,
      infoCom: this.form.get('infoCom').value,
      language: this.selectedLanguage
    };
    this.caseService.createCaseWithAbnormality(caseData, this.addedValues).subscribe(
      () => {
        this.selectedGenderOption = '';
        this.parameterForm.reset();
        this.form.reset();
        this.selectedLevelTypeOption = '';
        this.selectedParameterOption = '';
        this.selectedUnitOption = '';
        this.selectedAnemiaOption = ''

        sessionStorage.setItem('case-name', '');
        sessionStorage.setItem('diagnosis', '');
        sessionStorage.setItem('hr', '');
        sessionStorage.setItem('rr', '');
        sessionStorage.setItem('physExam', '');
        sessionStorage.setItem('infoCom', '');
        sessionStorage.removeItem('anemia-type');

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
        this.notifier.notify('success', 'Case has been created');
        this.caseDataService.refreshTable();
      },
      (error: HttpErrorResponse) => {
        this.notifier.notify('error', error.message);
      })
  }

  private mapLevelTypeOption(option: string): LevelTypes {
    switch (option) {
      case 'Degree 0':
        return LevelTypes.DEGREE_0
      case 'Degree I':
        return LevelTypes.DEGREE_I
      case 'Degree II':
        return LevelTypes.DEGREE_II
      case 'Degree III':
        return LevelTypes.DEGREE_III
      case 'Degree IV':
        return LevelTypes.DEGREE_IV;
      case 'Above normal':
        return LevelTypes.ABOVE_NORMAL;
      case 'Below normal':
        return LevelTypes.BELOW_NORMAL;
      case 'Normal':
        return LevelTypes.NORMAL;
      case 'Increased':
        return LevelTypes.INCREASED;
      case 'Decreased':
        return LevelTypes.DECREASED;
      default:
        throw new Error('Unknown option: ' + option);
    }
  }

}
