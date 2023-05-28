import { Component } from '@angular/core';

@Component({
  selector: 'app-cbc-table',
  templateUrl: './cbc-table.component.html',
  styleUrls: ['./cbc-table.component.css']
})
export class CbcTableComponent {
  cbcData = [
    {
      value: 'WBC',
      unit: '10^9/1',
      femaleMin: '4.0',
      femaleMax: '11.0',
      maleMin: '4.0',
      maleMax: '11.0'
    },
    {
      value: 'RBC',
      unit: '10^12/1',
      femaleMin: '4.0',
      femaleMax: '5.2',
      maleMin: '4.6',
      maleMax: '5.7'
    },
    {
      value: 'HGB',
      unit: 'g/dL',
      femaleMin: '11.5',
      femaleMax: '16.4',
      maleMin: '13.5',
      maleMax: '18.0'
    },
    {
      value: 'HCT',
      unit: '%',
      femaleMin: '37.0',
      femaleMax: '47.0',
      maleMin: '42.0',
      maleMax: '52.0'
    },
    {
      value: 'MCV',
      unit: 'fL',
      femaleMin: '81.0',
      femaleMax: '99.0',
      maleMin: '80.0',
      maleMax: '94.0'
    },
    {
      value: 'MCH',
      unit: 'pg',
      femaleMin: '27.0',
      femaleMax: '31.0',
      maleMin: '27.0',
      maleMax: '31.0'
    },
    {
      value: 'MCHC',
      unit: 'g/dL',
      femaleMin: '33.0',
      femaleMax: '37.0',
      maleMin: '33.0',
      maleMax: '37.0'
    },
    {
      value: 'PLT',
      unit: '10^9/1',
      femaleMin: '130.0',
      femaleMax: '450.0',
      maleMin: '130.0',
      maleMax: '450.0'
    },
    {
      value: 'NEU',
      unit: '10^9/1',
      femaleMin: '2',
      femaleMax: '7',
      maleMin: '2',
      maleMax: '7'
    },
    {
      value: 'LYM',
      unit: '10^9/1',
      femaleMin: '1',
      femaleMax: '4.5',
      maleMin: '1',
      maleMax: '4.5'
    },
    {
      value: 'MONO',
      unit: '10^9/1',
      femaleMin: '0.19',
      femaleMax: '0.77',
      maleMin: '0.19',
      maleMax: '0.77'
    },
    {
      value: 'EOS',
      unit: '10^9/1',
      femaleMin: '0.02',
      femaleMax: '0.5',
      maleMin: '0.02',
      maleMax: '0.5'
    },
    {
      value: 'BASO',
      unit: '10^9/1',
      femaleMin: '0.02',
      femaleMax: '0.1',
      maleMin: '0.02',
      maleMax: '0.1'
    },
    {
      value: 'NEU',
      unit: '%',
      femaleMin: '40-80',
      femaleMax: '',
      maleMin: '40-80',
      maleMax: ''
    },
    {
      value: 'LYM',
      unit: '%',
      femaleMin: '20-40',
      femaleMax: '',
      maleMin: '20-40',
      maleMax: ''
    },
    {
      value: 'MONO',
      unit: '%',
      femaleMin: '2-10',
      femaleMax: '',
      maleMin: '2-10',
      maleMax: ''
    },
    {
      value: 'EOS',
      unit: '%',
      femaleMin: '1-6',
      femaleMax: '',
      maleMin: '1-6',
      maleMax: ''
    },
    {
      value: 'BASO',
      unit: '%',
      femaleMin: '0-2',
      femaleMax: '',
      maleMin: '0-2',
      maleMax: ''
    },
  ];
}
