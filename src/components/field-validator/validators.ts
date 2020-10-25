import { Injector } from "@angular/core";
import { FieldType } from "./field-validator-base";

const V1_SPECIAL_CHARS_NO_DOT = /[><'"()%\\\/]+/;

 export class Password extends FieldType {
    pattern = {
      key: 'PASSWORD', // 密碼. 參考v1台新密碼, 只允許英文大小寫及數字.
      regex: /[A-Za-z\d]+/,
      minLength: 6,
      maxLength: 16,
      filterRegex: /[^A-Za-z\d]/,
      error: { password: true }
    }
  
    constructor(
      injector: Injector,
      maxLength: number,
      minLength: number,
      disableError: boolean = false,
    ) {
      super(injector, maxLength, minLength, disableError);
    }

    bindSpecificAttributeOnElement(): void {
      this.renderer.setAttribute(this.el.nativeElement, 'type', 'password');
    }
    
    skipKeyupListener(): boolean {
      if (this.initValue === this.ngControl.value) {
        return true;
      }
      return false;
    }
}

export class ID extends FieldType {
  pattern =  {
    key: 'ID', // 身分證字號. A123456789
    regex: /^([A-Za-z]){1}\d{9}$/,
    filterRegex: /[^a-zA-Z0-9]/,
    maxLength: 10,
    minLength: 10,
    error: { id: true }
  }

  constructor(
    injector: Injector,
    maxLength: number,
    minLength: number,
    disableError: boolean = false,
  ) {
    super(injector, maxLength, minLength, disableError);
  }

  bindSpecificAttributeOnElement(): void {
    return;
  }

  skipKeyupListener(): boolean {
    if (this.initValue === this.ngControl.value) {
      return true;
    }
    return false;
  }
}

export class Currnecy extends FieldType {
  pattern = {
    key: 'CURRENCY', // 金額. 1,000.00
    regex: /[\d,.]+/,
    filterRegex: /[^\d,.]+/,
    maxLength: 10,
    error: { currency: true }
  }

  constructor(
    injector: Injector,
    maxLength: number,
    minLength: number,
    disableError: boolean = false,
  ) {
    super(injector, maxLength, minLength, disableError);
  }

  bindSpecificAttributeOnElement(): void {
    return;
  }

  skipKeyupListener(): boolean {
    return this.initValue === this.ngControl.value;
  }
}

export class CurrencyMask extends FieldType {
  pattern = {
    key: 'CURRENCY_MASK', // 金額. 1,000.00
    regex: /[\d,.]+/,
    filterRegex: /[^\d,.]+/,
    maxLength: 10,
  }

  constructor(
    injector: Injector,
    maxLength: number,
    minLength: number,
    disableError: boolean = false,
  ) {
    super(injector, maxLength, minLength, disableError);
  }

  bindSpecificAttributeOnElement(): void {
    return;
  }

  skipKeyupListener(): boolean {
    return true;
  }
}

export class PureNumber extends FieldType {
  pattern = {
    key: 'PURE_NUM', // 只能輸入數字. 應用: 信用卡卡號.
    regex: /\d+/,
    filterRegex: /[^\d]+/,
    error: { purenum: true }
  }

  constructor(
    injector: Injector,
    maxLength: number,
    minLength: number,
    disableError: boolean = false,
  ) {
    super(injector, maxLength, minLength, disableError);
  }

  bindSpecificAttributeOnElement(): void {
    return;
  }

  skipKeyupListener(): boolean {
    return this.initValue === this.ngControl.value;
  }
}

export class Text extends FieldType {
  pattern =  {
    key: 'TEXT', // 基本欄位輸入. 可輸入英文,中文及數字. 只會過濾 regex: /[><'"()%\\\/]+/;
    regex: /[A-Za-z\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF\d]+/, 
    filterRegex: V1_SPECIAL_CHARS_NO_DOT
  }
  
  constructor(
    injector: Injector,
    maxLength: number,
    minLength: number,
    disableError: boolean = false,
  ) {
    super(injector, maxLength, minLength, disableError);
  }

  bindSpecificAttributeOnElement(): void {
    return;
  }

  skipKeyupListener(): boolean {
    return this.initValue === this.ngControl.value;
  }
}


export class Chinese extends FieldType {
  pattern =  {
    key: 'CHINESE', // 只能輸入中文. 應用: 中文姓名.
    regex: /[\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF]+/,
    filterRegex: /[^\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF]+/,
    error: { chinese: true}
  }
  
  constructor(
    injector: Injector,
    maxLength: number,
    minLength: number,
    disableError: boolean = false,
  ) {
    super(injector, maxLength, minLength, disableError);
  }

  bindSpecificAttributeOnElement(): void {
    return;
  }

  skipKeyupListener(): boolean {
    return this.initValue === this.ngControl.value;
  }
}


export class ChineseAndLetter extends FieldType {
  pattern =  {
    key: 'CHINESE_AND_LETTER', // 基本欄位輸入. 可輸入英文及中文.
    regex: /[A-Za-z\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF]+/,
    filterRegex: /[^A-Za-z\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF]+/,
    error: { chineseAndLetter: true }
  }
  
  constructor(
    injector: Injector,
    maxLength: number,
    minLength: number,
    disableError: boolean = false,
  ) {
    super(injector, maxLength, minLength, disableError);
  }

  bindSpecificAttributeOnElement(): void {
    return;
  }

  skipKeyupListener(): boolean {
    return this.initValue === this.ngControl.value;
  }
}

export class ChineseLetterNumber extends FieldType {
  pattern = {
    key: 'CHINESS_LETTER_NUM', // 基本欄位輸入. 可輸入英文,中文及數字.
    regex: /[A-Za-z\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF\d]+/,
    filterRegex: /[^A-Za-z\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF\d]+/,
    error: { chineseLetterNum: true }
  }
  
  constructor(
    injector: Injector,
    maxLength: number,
    minLength: number,
    disableError: boolean = false,
  ) {
    super(injector, maxLength, minLength, disableError);
  }

  bindSpecificAttributeOnElement(): void {
    return;
  }

  skipKeyupListener(): boolean {
    return this.initValue === this.ngControl.value;
  }
}

export class Letter extends FieldType {
  pattern = {
    key: 'LETTER', // 只能輸入英文.
    regex: /[A-Za-z]+/,
    filterRegex: /[^A-Za-z]+/,
    error: { letter: true }
  }

  constructor(
    injector: Injector,
    maxLength: number,
    minLength: number,
    disableError: boolean = false,
  ) {
    super(injector, maxLength, minLength, disableError);
  }

  bindSpecificAttributeOnElement(): void {
    return;
  }

  skipKeyupListener(): boolean {
    return this.initValue === this.ngControl.value;
  }
}

export class LetterAndNumber extends FieldType {
  pattern = {
    key: 'LETTER_AND_NUM', // 只能輸入英文大小寫及數字. 應用: 使用者代號.
    regex: /[A-Za-z\d]+/,
    filterRegex: /[^A-Za-z\d]+/,
    error: { letterAndNum: true}
  }

  constructor(
    injector: Injector,
    maxLength: number,
    minLength: number,
    disableError: boolean = false,
  ) {
    super(injector, maxLength, minLength, disableError);
  }

  bindSpecificAttributeOnElement(): void {
    return;
  }

  skipKeyupListener(): boolean {
    return this.initValue === this.ngControl.value;
  }
}

export class Email extends FieldType {
  pattern = {
    key: 'EMAIL', // 電子信箱. testmail@gmail.com
    regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    maxLength: 320, // 參考v1文件, 最多320字元.
    error: { email: true }
  }

  constructor(
    injector: Injector,
    maxLength: number,
    minLength: number,
    disableError: boolean = false,
  ) {
    super(injector, maxLength, minLength, disableError);
  }

  bindSpecificAttributeOnElement(): void {
    this.renderer.setAttribute(this.el.nativeElement, 'type', 'email');
    this.renderer.setAttribute(this.el.nativeElement, 'name', 'email');
  }

  skipKeyupListener(): boolean {
    return this.initValue === this.ngControl.value;
  }
}
