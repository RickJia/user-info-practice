import { Directive, ElementRef, Host, HostListener, Input, OnInit, Optional, Renderer2 } from '@angular/core';
import { NgControl, ValidationErrors } from '@angular/forms';
import { CurrencyMaskDirective } from 'ng2-currency-mask';
import { distinctUntilChanged } from 'rxjs/operators';

const SPECIAL_CHAR = `[><'"\(\)%\/\\\\\.]`; // 所有欄位預設值. 過濾掉指定的特殊符號(>, <, ', ", (, ), %, /, \, .)，若輸入半形小數點則 轉換為全形點: .
const LETTER_AND_NUM = `[A-Za-z\\d]`; // 字母跟數字
const COMMA_AND_NUM = `[\\d,.]`; // 金額
const PURE_NUM = `[\\d]`; // 純數字
const CHINESE_AND_LETTER = `[\u4e00-\u9fa5a-zA-Z]`; // 中文姓名、中英文姓名
const DECIMAL = `[><'"\(\)%\/\\\\\]`; // numberfield、金額、數字
const EMAIL =  `[><'"\(\)%\/\\\\\.]`; // emailfield、email

// 密碼欄位 任意文字、符號都可以

const ID = /^[A-Za-z]\d{9}/; // 身分證字號

// const ALL_SPECIAL_CHARS = /~!@#$%^&*()_+\-={}\[\];':"><\\\/,.?/;

const V1_SPECIAL_CHARS = /[><'"()%\\\/.]+/;
const V1_SPECIAL_CHARS_NO_DOT = /[><'"()%\\\/]+/;

const MIN_LENGTH = { minlength: true };
const MAX_LENGTH = { maxlength: true };

interface Pattern {
  key: string;
  regex?: RegExp;
  filterRegex?: RegExp;
  maxLength?: number;
  minLength?: number;
  error?: ValidationErrors;
}

const Patterns: Array<Pattern> = [
  {
    key: 'ID', // 身分證字號. A123456789
    regex: /^([A-Za-z]){1}\d{9}$/,
    filterRegex: /[^a-zA-Z0-9]/,
    maxLength: 10,
    minLength: 10,
    error: { id: true }
  },
  {
    key: 'CURRENCY', // 金額. 1,000.00
    regex: /[\d,.]+/,
    filterRegex: /[^\d,.]+/,
    maxLength: 10,
    error: { currency: true }
  },
  {
    key: 'CURRENCY_MASK' // 如果使用套件 currencyMask, 會特別設定 mobile 數字鍵盤.
  },
  {
    key: 'PURE_NUM', // 只能輸入數字. 應用: 信用卡卡號.
    regex: /\d+/,
    filterRegex: /[^\d]+/,
    error: { purenum: true }
  },
  {
    key: 'TEXT', // 基本欄位輸入. 可輸入英文,中文及數字. 只會過濾 regex: /[><'"()%\\\/]+/;
    regex: /[A-Za-z\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF\d]+/, 
    filterRegex: V1_SPECIAL_CHARS_NO_DOT
    // filterRegex: /[~!@#$%^&*()_+\-={}\[\];':"><\\\/,?]+/
  },
  {
    key: 'CHINESE', // 只能輸入中文. 應用: 中文姓名.
    regex: /[\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF]+/,
    filterRegex: /[^\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF]+/,
    // filterRegex: /[A-Za-z0-9~!@#$%^&*()_+\-={}\[\];':"><\\\/,.?]+/,
    error: { chinese: true}
  },
  {
    key: 'CHINESE_AND_LETTER', // 基本欄位輸入. 可輸入英文及中文.
    regex: /[A-Za-z\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF]+/,
    filterRegex: /[^A-Za-z\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF]+/,
    // filterRegex: /[0-9~!@#$%^&*()_+\-={}\[\];':"><\\\/,.?]+/,
    error: { chineseAndLetter: true }
  },
  {
    key: 'CHINESS_LETTER_NUM', // 基本欄位輸入. 可輸入英文,中文及數字.
    regex: /[A-Za-z\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF\d]+/,
    filterRegex: /[^A-Za-z\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF\d]+/,
    // filterRegex: /[~!@#$%^&*()_+\-={}\[\];':"><\\\/,?]+/
    error: { chineseLetterNum: true }
  },
  {
    key: 'LETTER', // 只能輸入英文.
    regex: /[A-Za-z]+/,
    filterRegex: /[^A-Za-z]+/,
    error: { letter: true }
  },
  {
    key: 'LETTER_AND_NUM', // 只能輸入英文大小寫及數字. 應用: 使用者代號.
    regex: /[A-Za-z\d]+/,
    filterRegex: /[^A-Za-z\d]+/,
    error: { letterAndNum: true}
  },
  {
    key: 'EMAIL', // 電子信箱. testmail@gmail.com
    regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    maxLength: 320, // 參考v1文件, 最多320字元.
    error: { email: true }
  },
  {
    key: 'PASSWORD', // 密碼. 參考v1台新密碼, 只允許英文大小寫及數字.
    regex: /[A-Za-z\d]+/,
    minLength: 6,
    maxLength: 16,
    filterRegex: /[^A-Za-z\d]/,
    error: { password: true }
  }
];

type PatterKey = 'ID' | 'CURRENCY' | 'PURE_NUM' | 'TEXT' | 'CHINESE' |
  'CHINESE_AND_LETTER' | 'EMAIL' | 'PASSWORD' | 'CURRENCY_MASK' | 'LETTER' |
  'LETTER_AND_NUM';

@Directive({
  selector: '[appFieldSecurityValidator]'
})
export class FieldSecurityValidatorDirective implements OnInit {

  @Input() patternKey: PatterKey = 'TEXT';
  @Input() maxLength: number;
  @Input() minLength: number;
  @Input() disableError: boolean = false;

  foundPattern: Pattern;

  initFieldValue = '';

  constructor(
    private readonly renderer: Renderer2,
    private readonly el: ElementRef,
    private readonly ngControl: NgControl,
    @Optional() @Host() private currencyMask: CurrencyMaskDirective
  ) { }

  ngOnInit(): void {
    this.initFieldValue = this.ngControl.control.value as string;
    this.foundPattern = this.getPattern(this.patternKey);
    this.bindtAttributeOnElement(this.foundPattern.key);
    this.onFieldValidationProcess();
  }

  bindtAttributeOnElement(key: string): void {
    if (this.currencyMask) {
      this.renderer.setAttribute(this.el.nativeElement, 'inputmode', 'decimal');
    }

    if (this.maxLength) {
      this.renderer.setAttribute(this.el.nativeElement, 'maxlength', this.maxLength.toString());
    } else {
      if (this.foundPattern.maxLength) {
        this.renderer.setAttribute(this.el.nativeElement, 'maxlength', this.foundPattern.maxLength.toString());
      }
    }

    if (this.minLength) {
      this.renderer.setAttribute(this.el.nativeElement, 'maxlength', this.minLength.toString());
    } else {
      if (this.foundPattern.minLength) {
        this.renderer.setAttribute(this.el.nativeElement, 'minlength', this.foundPattern.minLength.toString());
      }
    }

    switch (key) {
      case 'PASSWORD':
        this.renderer.setAttribute(this.el.nativeElement, 'type', 'password');
        return;
      case 'EMAIL':
        this.renderer.setAttribute(this.el.nativeElement, 'type', 'email');
        this.renderer.setAttribute(this.el.nativeElement, 'name', 'email');
        return;
      default:
        return;
    }
  }

  getPattern(patternKey: string): Pattern {
   return Patterns.find(pattern => pattern.key === patternKey);
  }

  skipKeyupListener() {
    if (this.foundPattern.key === 'CURRENCY_MASK') {
      return true;
    }
    if (this.initFieldValue === this.ngControl.value) {
      return true;
    }
    return false;
  }

  getError(): ValidationErrors {
    let fieldValue = this.ngControl.value as string;
    let errors = {};

    if (this.foundPattern.error && !this.foundPattern.regex.test(fieldValue)) {
      errors = {...this.foundPattern.error};
    }

    if (this.maxLength) {
      errors = fieldValue.length > this.maxLength ? {...errors, ...MAX_LENGTH} : {...errors};
    } else {
      if (this.foundPattern.maxLength && fieldValue.length > this.foundPattern.maxLength) {
        errors = {...errors, ...MAX_LENGTH};
      }
    }

    if (this.minLength) {
      errors = fieldValue.length < this.minLength ?  {...errors, ...MIN_LENGTH} : {...errors};
    } else {
      if (this.foundPattern.minLength && fieldValue.length < this.foundPattern.minLength) {
        errors = {...errors, ...MIN_LENGTH};
      }
    }

    return errors;
  }

  // @HostListener('keyup') onTyping(): void {
  //   if (this.skipKeyupListener()) {
  //     return;
  //   }
  //   let fieldValue = this.ngControl.value as string;
   
  //   console.log(fieldValue);
  //   if (this.foundPattern.filterRegex) {
  //     fieldValue = fieldValue.replace(this.foundPattern.filterRegex, '');
  //     if (this.foundPattern.key === 'TEXT') { // 如果 key 是 TEXT 的話, 將半形"."轉換成全行.
  //       fieldValue = fieldValue.replace(/[.]/g, '．');
  //     }
  //     this.ngControl.control.setValue(fieldValue);
  //   }

  //   this.initFieldValue = fieldValue; // 記憶最後值

  //   const errors = this.getError();
   
  //   if (!this.disableError && Object.keys(errors).length > 0) {
  //     this.ngControl.control.setErrors(errors);
  //     console.log(errors);
  //   }
  // }

  maxLengthTrim(value: string): string {
    const maxlength = this.el.nativeElement.getAttribute('maxlength');
    if (value && maxlength) {
     
      value = value.substr(0, maxlength);
      
    }
    return value;
  }


  onFieldValidationProcess(): void {
    this.ngControl.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(value =>{
      if (this.skipKeyupListener()) {
        return;
      }
      let fieldValue = value as string;

      fieldValue = this.maxLengthTrim(value);
     
      console.log(fieldValue);
      if (this.foundPattern.filterRegex) {
        fieldValue = fieldValue.replace(this.foundPattern.filterRegex, '');
        if (this.foundPattern.key === 'TEXT') { // 如果 key 是 TEXT 的話, 將半形"."轉換成全行.
          fieldValue = fieldValue.replace(/[.]/g, '．');
        }
        this.ngControl.control.setValue(fieldValue);
      }
  
      this.initFieldValue = fieldValue; // 記憶最後值
  
      const errors = this.getError();
     
      if (!this.disableError && Object.keys(errors).length > 0) {
        this.ngControl.control.setErrors(errors);
        console.log(errors);
      }
    });
  }

}
