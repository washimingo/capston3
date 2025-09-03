import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TipsAyudaPage } from './tips-ayuda.page';

describe('TipsAyudaPage', () => {
  let component: TipsAyudaPage;
  let fixture: ComponentFixture<TipsAyudaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TipsAyudaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
