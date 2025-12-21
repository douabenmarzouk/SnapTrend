import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinDetailComponent } from './pin-detail';

describe('PinDetail', () => {
  let component: PinDetailComponent;
  let fixture: ComponentFixture<PinDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PinDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PinDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
