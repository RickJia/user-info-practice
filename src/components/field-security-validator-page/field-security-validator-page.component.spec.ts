import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldSecurityValidatorPageComponent } from './field-security-validator-page.component';

describe('FieldSecurityValidatorPageComponent', () => {
  let component: FieldSecurityValidatorPageComponent;
  let fixture: ComponentFixture<FieldSecurityValidatorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldSecurityValidatorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldSecurityValidatorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
