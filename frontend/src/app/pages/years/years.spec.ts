import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Years } from './years';

describe('Years', () => {
  let component: Years;
  let fixture: ComponentFixture<Years>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Years]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Years);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
