import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-field-security-validator-page',
  templateUrl: './field-security-validator-page.component.html',
  styleUrls: ['./field-security-validator-page.component.scss']
})
export class FieldSecurityValidatorPageComponent implements OnInit {

  profileForm: FormGroup;
  
  constructor(private readonly fb: FormBuilder) { 
    this.profileForm = this.fb.group({
      id: '',
      chineseName: '',
      currency: '',
      currencyWithMask: '',
      purenum: '',
      letter: '',
      text: '',
      chineseAndEnglish: '',
      email: '',
      password: '',
      selfDefId: '',
      creditCard: '',
      account: '',
      chineseLetterNum: ''
    })


  }

  ngOnInit(): void {
  }

}
