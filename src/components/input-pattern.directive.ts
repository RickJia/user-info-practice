import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { NgControl, ValidationErrors } from '@angular/forms';

interface Pattern {
  key: string;
  regex: RegExp;
  filterRegex?: RegExp;
  maxLength?: number;
  minLength?: number;
  error?: ValidationErrors;
}

const Patterns: Array<Pattern> = [
  {
    key: 'ID', // 身分證字號
    regex: /^([A-Za-z]){1}\d{9}$/,
    filterRegex: /[^a-zA-Z0-9]/,
    maxLength: 10,
    minLength: 10,
    error: { id: true }
  },
]

type PatterKey = 'ID';


@Directive({
  selector: '[appInputPattern]'
})
export class InputPatternDirective {

  @Input() patternKey: PatterKey = 'ID';

  foundPattern: Pattern;

  constructor(
    private renderer: Renderer2, 
    private el: ElementRef,
    private ngControl: NgControl
  ) { }

  ngOnInit() {
    this.foundPattern = this.getPattern(this.patternKey);
    if (this.foundPattern.maxLength) {
      this.renderer.setAttribute(this.el.nativeElement, 'maxlength', this.foundPattern.maxLength.toString());
    }

    if (this.foundPattern.minLength) {
      this.renderer.setAttribute(this.el.nativeElement, 'minlength', this.foundPattern.minLength.toString());
    }
  }

  getPattern(patternKey: string): Pattern {
   return Patterns.find(pattern => pattern.key === patternKey);
  }

  @HostListener('keyup') 
  onTyping(): void {
    let fieldValue = this.ngControl.value as string;

    if (this.foundPattern.filterRegex) {
      fieldValue = fieldValue.replace(this.foundPattern.filterRegex, '');
      this.ngControl.control.setValue(fieldValue);
    }

    if (this.foundPattern.error && !this.foundPattern.regex.test(fieldValue)) {
      this.ngControl.control.setErrors(this.foundPattern.error);
    }
  }

}
