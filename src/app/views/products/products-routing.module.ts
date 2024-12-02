/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    data: {
      title: 'Product List',
    },
    component: ListComponent,
  },
  {
    path: 'create',
    data: {
      title: 'Create new Product',
    },
    component: CreateComponent,
  },
  {
    path: 'edit/:productId',
    data: {
      title: 'Edit Product',
    },
    component: EditComponent,
  },
  {
    path: 'dashboard/:url',
    data: {
      title: 'Dashboard',
    },
    component: DashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
