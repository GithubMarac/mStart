import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsGridComponent } from './applications-grid.component';

describe('ApplicationsGridComponent', () => {
  let component: ApplicationsGridComponent;
  let fixture: ComponentFixture<ApplicationsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationsGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
