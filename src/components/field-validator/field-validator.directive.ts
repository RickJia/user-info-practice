import { Directive,  Host, Injector, Input, OnInit, Optional, HostListener } from '@angular/core';
import { CurrencyMaskDirective } from 'ng2-currency-mask';
import { FieldType } from './field-validator-base';
import { Password, Text, ID, Currnecy,
   CurrencyMask, PureNumber, Chinese, ChineseAndLetter, 
   ChineseLetterNumber, Letter, LetterAndNumber, Email 
} from './validators'

@Directive({
  selector: '[appFieldValidator]'
})
export class FieldValidatorDirective implements OnInit {

  fieldTypeInstance: FieldType;

  @Input() patternKey: string = 'TEXT';
  @Input() maxLength: number;
  @Input() minLength: number;
  @Input() disableError: boolean = false;

  constructor(
    private readonly injector: Injector,
    @Optional() @Host() private currencyMask: CurrencyMaskDirective
  ) { }

  ngOnInit(): void {
    this.fieldTypeInstance = this.getPatternInstance(this.currencyMask ? 'CURRENCY_MASK' : this.patternKey);
    this.fieldTypeInstance.setInitValue();
    this.fieldTypeInstance.bindAttributeOnElement();
  }

  getPatternInstance(key): FieldType {
    switch (key) {
      case 'ID':
        return new ID(this.injector, this.maxLength, this.minLength, this.disableError);
      case 'EMAIL':
        return new Email(this.injector, this.maxLength, this.minLength, this.disableError);      
      case 'PASSWORD':
        return new Password(this.injector, this.maxLength, this.minLength, this.disableError);
      case 'PURE_NUM':
        return new PureNumber(this.injector, this.maxLength, this.minLength, this.disableError);
      case 'CURRENCY':
        return new Currnecy(this.injector, this.maxLength, this.minLength, this.disableError);      
      case 'CURRENCY_MASK':
        return new CurrencyMask(this.injector, this.maxLength, this.minLength, this.disableError);
      case 'CHINESE':
        return new Chinese(this.injector, this.maxLength, this.minLength, this.disableError);      
      case 'CHINESE_AND_LETTER':
        return new ChineseAndLetter(this.injector, this.maxLength, this.minLength, this.disableError);
      case 'CHINESS_LETTER_NUM':
        return new ChineseLetterNumber(this.injector, this.maxLength, this.minLength, this.disableError);      
      case 'LETTER':
        return new Letter(this.injector, this.maxLength, this.minLength, this.disableError);
      case 'LETTER_AND_NUM':
        return new LetterAndNumber(this.injector, this.maxLength, this.minLength, this.disableError);
      case 'TEXT':
        return new Text(this.injector, this.maxLength, this.minLength, this.disableError);
      default: 
        return
    }
  }

  @HostListener('keyup') onTyping(): void {
    this.fieldTypeInstance.onTyping();
  }
}
