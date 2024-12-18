import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShippingRatesRoutingModule } from './shipping-rates-routing.module';
import { ShippingRatesComponent } from './shipping-rates.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';


@NgModule({
  declarations: [
    ShippingRatesComponent,
  ],
  imports: [
    CommonModule,
    ShippingRatesRoutingModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatGridListModule,
    MatDividerModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatChipsModule,
  ]
})
export class ShippingRatesModule { }
