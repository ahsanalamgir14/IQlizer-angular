import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageDisplayRoutingModule } from './image-display-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageDisplayComponent } from './image-display.component';


@NgModule({
  declarations: [
    ImageDisplayComponent
  ],
  imports: [
    CommonModule,
    ImageDisplayRoutingModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatGridListModule,
    MatDividerModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatChipsModule,
    MatProgressSpinnerModule

  ]
})
export class ImageDisplayModule { }
