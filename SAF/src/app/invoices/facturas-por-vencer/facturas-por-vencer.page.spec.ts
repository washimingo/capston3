import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacturasPorVencerPage } from './facturas-por-vencer.page';

describe('FacturasPorVencerPage', () => {
  let component: FacturasPorVencerPage;
  let fixture: ComponentFixture<FacturasPorVencerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturasPorVencerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
