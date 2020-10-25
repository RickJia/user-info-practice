import { ElementRef, Injector, Renderer2 } from '@angular/core';
import { NgControl, ValidationErrors } from '@angular/forms';

const MIN_LENGTH = { minlength: true };
const MAX_LENGTH = { maxlength: true };


export interface Pattern {
    key: string;
    regex?: RegExp;
    filterRegex?: RegExp;
    maxLength?: number;
    minLength?: number;
    error?: ValidationErrors;
}

export abstract class FieldType {
    protected ngControl: NgControl;
    protected renderer: Renderer2;
    protected el: ElementRef;
  
    initValue: string | number;
    pattern: Pattern;
  
    constructor(
      private readonly injector: Injector,
      private readonly maxLength: number,
      private readonly minLength: number,
      private readonly disableError: boolean = false,
    ){
      this.setDependency();
    }

    abstract bindSpecificAttributeOnElement(): void;
    abstract skipKeyupListener(): boolean;
  
    bindAttributeOnElement(): void {
      if (this.maxLength) {
        this.renderer.setAttribute(this.el.nativeElement, 'maxlength', this.maxLength.toString());
      } else {
        if (this.pattern.maxLength) {
          this.renderer.setAttribute(this.el.nativeElement, 'maxlength', this.pattern.maxLength.toString());
        }
      }
  
      if (this.minLength) {
        this.renderer.setAttribute(this.el.nativeElement, 'maxlength', this.minLength.toString());
      } else {
        if (this.pattern.minLength) {
          this.renderer.setAttribute(this.el.nativeElement, 'minlength', this.pattern.minLength.toString());
        }
      }
      this.bindSpecificAttributeOnElement();
    }
  
    setInitValue() {
      if (isNaN(this.ngControl.control.value)) {
        this.initValue = this.ngControl.control.value as string;
      } else {
        this.initValue = this.ngControl.control.value as number;
      }
      this.initValue = this.ngControl.control.value;
    }
  
    onTyping(): void {
      if (this.skipKeyupListener()) {
        return;
      }

      let fieldValue = this.ngControl.value as string;
  
      if (this.pattern.filterRegex) {
        fieldValue = fieldValue.replace(this.pattern.filterRegex, '');
        this.ngControl.control.setValue(fieldValue);
      }
  
      this.initValue = fieldValue; // 記憶最後值
  
      const errors = this.getError();
     
      if (!this.getDisableError() && Object.keys(errors).length > 0) {
        this.ngControl.control.setErrors(errors);
      }
      console.log(errors);
    }
  
    getError(): ValidationErrors {
      let fieldValue = this.ngControl.value as string;
      let errors = {};
  
      if (this.pattern.error && !this.pattern.regex.test(fieldValue)) {
        errors = {...this.pattern.error};
      }
  
      if (this.maxLength) {
        errors = fieldValue.length > this.maxLength ? {...errors, ...MAX_LENGTH} : {...errors};
      } else {
        if (this.pattern.maxLength && fieldValue.length > this.pattern.maxLength) {
          errors = {...errors, ...MAX_LENGTH};
        }
      }
  
      if (this.minLength) {
        errors = fieldValue.length < this.minLength ?  {...errors, ...MIN_LENGTH} : {...errors};
      } else {
        if (this.pattern.minLength && fieldValue.length < this.pattern.minLength) {
          errors = {...errors, ...MIN_LENGTH};
        }
      }
  
      return errors;
    }
  
    setDependency() {
      this.ngControl = this.getNgControl();
      this.renderer = this.getRenderer2();
      this.el = this.getElementRef();
    }
  
    getNgControl(): NgControl {
      return this.injector.get(NgControl);
    }
  
    getRenderer2(): Renderer2 {
      return this.injector.get(Renderer2);
    }
  
    getElementRef(): ElementRef {
      return this.injector.get(ElementRef);
    }
  
    getDisableError(): boolean {
      return this.disableError;
    }
}
  