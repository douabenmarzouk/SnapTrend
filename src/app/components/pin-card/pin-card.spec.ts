import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PinCard } from './pin-card';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { PinterestService } from '../../services/pinterest.service';
import { Pin } from '../../models/pin.model';

describe('PinCardComponent', () => {
  let component: PinCard;
  let fixture: ComponentFixture<PinCard>;
  let pinterestServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    routerMock = { navigate: jasmine.createSpy('navigate') };
    pinterestServiceMock = { savePinForUser: jasmine.createSpy('savePinForUser').and.returnValue(of(null)) };

    await TestBed.configureTestingModule({
      imports: [PinCard],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: PinterestService, useValue: pinterestServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PinCard);
    component = fixture.componentInstance;

    component.pin = {
      id: '1',
      title: 'Test Pin',
      description: 'Une description',
      image: 'test.png',
      link: 'https://example.com',
      author: { name: 'John Doe', avatar: 'avatar.png' },
      tags: [],
      likes: 0,
      saves: 0
    } as unknown as Pin;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit pinClicked on onPinClick', () => {
    spyOn(component.pinClicked, 'emit');
    component.onPinClick();
    expect(component.pinClicked.emit).toHaveBeenCalledWith(component.pin);
  });

  it('should emit pinSaved on onSavePin', () => {
    spyOn(component.pinSaved, 'emit');
    component.onSavePin(new Event('click'));
    expect(component.isSaving).toBeFalse();
    expect(component.pinSaved.emit).toHaveBeenCalledWith('1');
    expect(pinterestServiceMock.savePinForUser).toHaveBeenCalledWith('current-user', component.pin);
  });
});
