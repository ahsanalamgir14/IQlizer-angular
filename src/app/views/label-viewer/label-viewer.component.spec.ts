import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelViewerComponent } from './label-viewer.component';

describe('LabelViewerComponent', () => {
  let component: LabelViewerComponent;
  let fixture: ComponentFixture<LabelViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabelViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
