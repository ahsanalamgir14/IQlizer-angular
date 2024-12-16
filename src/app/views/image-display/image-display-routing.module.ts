import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageDisplayComponent } from './image-display.component';

const routes: Routes = [
  {
    path: '',
    component: ImageDisplayComponent,
    data: {
      title: 'Image Display',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageDisplayRoutingModule { }
