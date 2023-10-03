import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
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
import { Language } from 'src/app/enums/language.enum';
import { Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { ParamStatus } from 'src/app/enums/paramStatus.enum';

const AnemiaTypePL = {
  [AnemiaType.NormochromicNormocytic]: 'Normochromiczna, normocytarna',
  [AnemiaType.NormochromicMacrocytic]: 'Normochromiczna, makrocytarna',
  [AnemiaType.NormochromicMicrocytic]: 'Normochromiczna, mikrocytarna',
  [AnemiaType.HypochromicMicrocytic]: 'Hipochromiczna, mikrocytarna',
  [AnemiaType.HypochromicNormocytic]: 'Hipochromiczna, normocytarna',
  [AnemiaType.HypochromicMacrocytic]: 'Hipochromiczna, makrocytarna',
  [AnemiaType.HyperchromicMacrocytic]: 'Hiperchromiczna, makrocytarna',
  [AnemiaType.NotAnemic]: 'Pacjent nie ma niedokrwistości'
};

const AffectedGendersPL = {
  [AffectedGenders.FEMALE]: 'KOBIETA',
  [AffectedGenders.MALE]: 'MĘŻCZYZNA',
  [AffectedGenders.BOTH]: 'OBIE'
};

const parameterList = [
  'HGB', 'MCV', 'MCH', 'RDW_CV', 'RDW_SD', 'PLT', 'WBC',
  'NEU', 'LYM', 'MONO', 'EOS', 'BASO'
];

const polishToEnglishMap: { [key: string]: AffectedGenders } = {
  'KOBIETA': AffectedGenders.FEMALE,
  'MĘŻCZYZNA': AffectedGenders.MALE,
  'OBIE': AffectedGenders.BOTH,
};

@Component({
  selector: 'app-case-page',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CaseComponent implements OnInit {
  isMobile: boolean;
  form: FormGroup;
  parameterForm: FormGroup;
  addedValues: ICreateAbnormalityRequest[] = [];
  genderDropdownOptions: any = Object.values(AffectedGenders);
  selectedGenderOption = '';
  genderDropdownOpen = false;
  showSecondRangeForm = false;

  languageDropdownOptions = Object.values(Language)
  selectedLanguageOption = 'EN';
  caseName: string
  langDropdownOpen = false

  selectedAnemiaOption = '';
  anemiaDropdownOpen = false;
  anemiaTypesOptions: any = Object.values(AnemiaType)

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
  private resizeSubject = new Subject<Event>();
  showTooltip = window.innerWidth > 450;
  showCaseTooltipInfo: boolean = false;
  showAbnormalTooltipInfo: boolean = false;
  showAgeTooltipInfo: boolean = false;
  isSum100: boolean = true;
  doesContainWhiteBloodCells: boolean = false;
  paramStatus: ParamStatus = ParamStatus.INITIAL;

  constructor(
    private fb: FormBuilder,
    private caseService: CaseService,
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
      'description': ['', Validators.required],
      'bodyMass': ['', Validators.required],
      'height': ['', Validators.required],
      'bmi': [{ value: '', disabled: true }, Validators.required],
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

    this.resizeSubject.pipe(
      debounceTime(200)
    ).subscribe(event => {
      this.showTooltip = window.innerWidth > 450;
    });
  }

  ngOnInit() {
    this.referenceTableSubscription = this.referanceTable.fetchBCReferenceTable().subscribe(data => {
      this.parameterDropdownOptions = [data]
        .flatMap((subArray) => subArray)
        .map(data => data.parameter)
        .filter((value, index, self) => self.indexOf(value) === index)
        .filter(value => parameterList.includes(value));
      this.unitDropdownOptions = [data].flatMap((subArray) => subArray).map(data => data.unit).filter((value, index, self) => self.indexOf(value) === index);
    });
    this.restoreFormValues()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.resizeSubject.next(event);
  }

  updateAnemiaTypes(lang: string) {
    if (lang === 'EN') {
      this.anemiaTypesOptions = Object.values(AnemiaType);
    } else {
      this.anemiaTypesOptions = Object.values(AnemiaType).map(type => AnemiaTypePL[type]);
    }
  }

  updateAffectedGenders(lang: string) {
    if (lang === 'EN') {
      this.genderDropdownOptions = Object.values(AffectedGenders);
    } else {
      this.genderDropdownOptions = Object.values(AffectedGenders).map(type => AffectedGendersPL[type]);
    }
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
    this.form.get('description').setValue(sessionStorage.getItem('description'));
    this.form.get('bodyMass').setValue(sessionStorage.getItem('bodyMass'));
    this.form.get('height').setValue(sessionStorage.getItem('height'));
    this.form.get('bmi').setValue(sessionStorage.getItem('bmi'));
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
    const storedLangGenderOption = sessionStorage.getItem('selectedLanguageOption');
    if (storedLangGenderOption) {
      this.selectedLanguageOption = storedLangGenderOption;
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
      this.levelTypeDropdownOptions = ['Below normal 1', 'Below normal 2', 'Normal', 'Above normal 1', 'Above normal 2']
    }
    else if (this.selectedParameterOption == 'MCH') {
      this.selectedUnitOption = 'pg'
      this.disabledUnit = true
      this.unitDropdownOpen = false
      this.disabledRange = true
      this.levelTypeDropdownOptions = ['Below normal 1', 'Below normal 2', 'Normal', 'Above normal 1', 'Above normal 2']
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
      this.selectedUnitOption = '%'
      this.unitDropdownOpen = false
      this.disabledUnit = true
      this.disabledRange = false
      this.levelTypeDropdownOptions = ['Increased', 'Normal', 'Decreased']
    }
    else {
      this.disabledUnit = false
      this.disabledRange = false
      this.levelTypeDropdownOptions = ['Increased', 'Normal', 'Decreased']
    }
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
        sessionStorage.setItem('description', this.form.get('description').value);
        break;
      case 13:
        sessionStorage.setItem('infoCom', this.form.get('infoCom').value);
        break;
      case 14:
        sessionStorage.setItem('bodyMass', this.form.get('bodyMass').value);
        this.calculateAndSetBMI();
        break;
      case 15:
        sessionStorage.setItem('height', this.form.get('height').value);
        this.calculateAndSetBMI();
        break;
      case 16:
        sessionStorage.setItem('bmi', this.form.get('bmi').value);
        break;
    }
  }

  calculateAndSetBMI() {
    const bodyMass = parseFloat(this.form.get('bodyMass').value);
    const heightInCm = parseFloat(this.form.get('height').value);

    const heightInMeters = heightInCm / 100;

    if (bodyMass && heightInMeters) {
      const bmi = bodyMass / Math.pow(heightInMeters, 2);
      this.form.get('bmi').setValue(bmi.toFixed(2));
      sessionStorage.setItem('bmi', bmi.toFixed(2));
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

  selectLangOption(option: string) {
    this.selectedLanguageOption = option;
    this.langDropdownOpen = false;
    this.updateAnemiaTypes(option);
    this.updateAffectedGenders(option);
    sessionStorage.setItem('selectedLanguageOption', option);
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

  toggleLangDropdown() {
    this.langDropdownOpen = !this.langDropdownOpen;
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
        sessionStorage.setItem('parameter-min', '4.8')
        sessionStorage.setItem('parameter-max', '6.5')
        this.restoreFormValues()
        break;
    }
    if (this.selectedParameterOption == 'MCV' && this.selectedUnitOption == 'fl') {
      switch (this.selectedLevelTypeOption) {
        case 'Below normal 1':
          sessionStorage.setItem('parameter-min', '65')
          sessionStorage.setItem('parameter-max', '75')
          this.restoreFormValues()
          break;
        case 'Below normal 2':
          sessionStorage.setItem('parameter-min', '76')
          sessionStorage.setItem('parameter-max', '80')
          this.restoreFormValues()
          break;
        case 'Normal':
          sessionStorage.setItem('parameter-min', '81')
          sessionStorage.setItem('parameter-max', '94')
          this.restoreFormValues()
          break;
        case 'Above normal 1':
          sessionStorage.setItem('parameter-min', '100')
          sessionStorage.setItem('parameter-max', '105')
          this.restoreFormValues()
          break;
        case 'Above normal 2':
          sessionStorage.setItem('parameter-min', '106')
          sessionStorage.setItem('parameter-max', '112')
          this.restoreFormValues()
          break;
      }
    }
    if (this.selectedParameterOption == 'MCH' && this.selectedUnitOption == 'pg') {
      switch (this.selectedLevelTypeOption) {
        case 'Below normal 1':
          sessionStorage.setItem('parameter-min', '23')
          sessionStorage.setItem('parameter-max', '26')
          this.restoreFormValues()
          break;
        case 'Below normal 2':
          sessionStorage.setItem('parameter-min', '15')
          sessionStorage.setItem('parameter-max', '22')
          this.restoreFormValues()
          break;
        case 'Normal':
          sessionStorage.setItem('parameter-min', '27')
          sessionStorage.setItem('parameter-max', '31')
          this.restoreFormValues()
          break;
        case 'Above normal 1':
          sessionStorage.setItem('parameter-min', '32')
          sessionStorage.setItem('parameter-max', '35')
          this.restoreFormValues()
          break;
        case 'Above normal 2':
          sessionStorage.setItem('parameter-min', '36')
          sessionStorage.setItem('parameter-max', '40')
          this.restoreFormValues()
          break;
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
      this.levelTypeDropdownOptions = ['Below normal 1', 'Below normal 2', 'Normal', 'Above normal 1', 'Above normal 2']
      this.selectedLevelTypeOption = '';
      sessionStorage.setItem('selectedLevelTypeOption', '');
      this.restoreFormValues()
    }
    else if (this.selectedParameterOption == 'MCV') {
      this.selectedUnitOption = 'fl'
      this.disabledUnit = true
      this.unitDropdownOpen = false
      this.levelTypeDropdownOptions = ['Below normal 1', 'Below normal 2', 'Normal', 'Above normal 1', 'Above normal 2']
      this.selectedLevelTypeOption = '';
      sessionStorage.setItem('selectedLevelTypeOption', '');
      this.restoreFormValues()
    }
    else if (this.selectedParameterOption == 'NEU' || this.selectedParameterOption == 'LYM'
      || this.selectedParameterOption == 'MONO' || this.selectedParameterOption == 'EOS' || this.selectedParameterOption == 'BASO') {
      this.selectedUnitOption = '10^9/L'
      this.unitDropdownOpen = false
      this.selectedLevelTypeOption = '';
      sessionStorage.setItem('selectedLevelTypeOption', '');
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
      this.levelTypeDropdownOptions = ['Below normal 1', 'Below normal 2', 'Normal', 'Above normal 1', 'Above normal 2']
      this.selectedLevelTypeOption = '';
      sessionStorage.setItem('selectedLevelTypeOption', '');
      this.restoreFormValues()
    }
    else if (this.selectedParameterOption == 'MCV' && this.selectedUnitOption == 'fl') {
      this.disabledRange = true
      this.levelTypeDropdownOptions = ['Below normal 1', 'Below normal 2', 'Normal', 'Above normal 1', 'Above normal 2']
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

    const allowedParameters = ['NEU', 'LYM', 'MONO', 'EOS', 'BASO'];
    let allDeleted = true;
    for (let allowedParam of allowedParameters) {
      if (this.addedValues.some(item => item.parameter === allowedParam)) {
        allDeleted = false;
        break;
      }
    }
    if (allDeleted) {
      this.paramStatus = ParamStatus.ALL_ALLOWED_DELETED;
    }
  }

  addValue() {
    const parameter = this.selectedParameterOption
    const unit = this.selectedUnitOption
    let enteredMinValue = this.parameterForm.get('parameter-min').value;
    let enteredMaxValue = this.parameterForm.get('parameter-max').value;
    const levelType = this.mapLevelTypeOption(this.selectedLevelTypeOption);

    if (!parameter || enteredMinValue === null || enteredMinValue === undefined || enteredMaxValue === null || enteredMaxValue === undefined || !levelType || !unit) {
      return;
    }

    const parameterExists = this.addedValues.some(item => item.parameter === parameter);

    if (parameterExists) {
      this.notifier.notify('default', 'This parameter already exists.');
      return;
    }

    const abnormalityData: ICreateAbnormalityRequest = {
      parameter,
      unit,
      minValue: enteredMinValue,
      maxValue: enteredMaxValue,
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

  randomizeAllowedBloodCounts(addedValues: ICreateAbnormalityRequest[]): Map<string, number> {
    const allowedParameters = ['NEU', 'LYM', 'MONO', 'EOS', 'BASO'];

    let filteredBloodCounts = addedValues.filter(bc => allowedParameters.includes(bc.parameter));

    if (filteredBloodCounts.length != 0) {
      this.doesContainWhiteBloodCells = true;
    } else {
      this.doesContainWhiteBloodCells = false;
    }


    let remainingPercentage = 100;
    const randomizedValuesMap = new Map<string, number>();
    this.isSum100 = true;

    let minPossibleSum = filteredBloodCounts.reduce((acc, cur) => acc + cur.minValue, 0);
    let maxPossibleSum = filteredBloodCounts.reduce((acc, cur) => acc + cur.maxValue, 0);

    if (minPossibleSum > 100 || maxPossibleSum < 100) {
      this.isSum100 = false;
      return randomizedValuesMap;
    }

    if (this.isSum100) {
      for (let i = 0; i < filteredBloodCounts.length - 1; i++) {
        let { parameter, minValue: min, maxValue: max } = filteredBloodCounts[i];
        let adjustedMax = Math.min(max, remainingPercentage - (filteredBloodCounts.length - i - 1));
        let randomizedValue = Math.floor(Math.random() * (adjustedMax - min + 1) + min);

        randomizedValuesMap.set(parameter, randomizedValue);
        remainingPercentage -= randomizedValue;
      }

      if (filteredBloodCounts.length > 0) {
        randomizedValuesMap.set(filteredBloodCounts[filteredBloodCounts.length - 1].parameter, remainingPercentage);
      }
    }

    return randomizedValuesMap;
  }


  createCaseWithAbnormality() {
    this.randomizeAllowedBloodCounts(this.addedValues);

    if (!this.isSum100 && this.doesContainWhiteBloodCells) {
      return;
    }

    let mappedGenderOption: AffectedGenders;
    if (this.selectedLanguageOption === 'PL') {
      mappedGenderOption = this.toEnglishGender(this.selectedGenderOption)
    } else {
      mappedGenderOption = this.selectedGenderOption as AffectedGenders;
    }

    const caseData: ICreateCaseRequest = {
      anemiaType: this.selectedAnemiaOption as AnemiaType,
      diagnosis: this.form.get('diagnosis').value,
      caseName: this.form.get('case-name').value,
      firstMinAge: this.form.get('first-min').value,
      firstMaxAge: this.form.get('first-max').value,
      secondMinAge: this.form.get('second-min').value || 0,
      secondMaxAge: this.form.get('second-max').value || 0,
      affectedGender: mappedGenderOption,
      hr: this.form.get('hr').value,
      rr: this.form.get('rr').value,
      description: this.form.get('description').value,
      bodyMass: this.form.get('bodyMass').value,
      height: this.form.get('height').value,
      bmi: this.form.get('bmi').value,
      infoCom: this.form.get('infoCom').value,
      language: this.selectedLanguageOption as Language
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
        this.selectedLanguageOption = '';

        sessionStorage.setItem('case-name', '');
        sessionStorage.setItem('diagnosis', '');
        sessionStorage.setItem('hr', '');
        sessionStorage.setItem('rr', '');
        sessionStorage.setItem('description', '');
        sessionStorage.setItem('bodyMass', '');
        sessionStorage.setItem('height', '');
        sessionStorage.setItem('bmi', '');

        sessionStorage.setItem('infoCom', '');
        sessionStorage.removeItem('anemia-type');

        sessionStorage.removeItem('first-min');
        sessionStorage.removeItem('first-max');
        sessionStorage.removeItem('second-min');
        sessionStorage.removeItem('second-max');
        sessionStorage.removeItem('selectedGenderOption');
        sessionStorage.removeItem('selectedLanguageOption');
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
        this.selectedLanguageOption = 'EN';
        this.isSum100 = true;
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
      case 'Above normal 1':
        return LevelTypes.ABOVE_NORMAL_1;
      case 'Below normal 1':
        return LevelTypes.BELOW_NORMAL_1;
      case 'Above normal 2':
        return LevelTypes.ABOVE_NORMAL_2;
      case 'Below normal 2':
        return LevelTypes.BELOW_NORMAL_2;
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

  toEnglishGender(polishGender: string): AffectedGenders {
    return polishToEnglishMap[polishGender];
  }
}
