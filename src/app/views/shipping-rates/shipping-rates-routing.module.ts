import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShippingRatesComponent } from './shipping-rates.component';

const routes: Routes = [
  {
    path: '',
    component: ShippingRatesComponent,
    data: {
      title: 'Shipping Rates',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShippingRatesRoutingModule { }
