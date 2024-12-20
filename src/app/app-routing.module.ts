import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { AuthComponent } from './views/auth/auth.component';
import { UnauthorizedComponent } from './views/error/unauthorized.component';
import { CognitoGuard } from './cognito.guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'unauthorized',
    pathMatch: 'full',
  },
  {
    path: '',
    component: NavComponent,
    canActivate: [CognitoGuard],
    data: {
      title: 'Home',
    },
    children: [
      {
        path: 'auth/info',
        component: AuthComponent,
      },
     
      {
        path: 'products',
        loadChildren: () =>
          import('./views/products/products.module').then(
            (m) => m.ProductsModule
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./views/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'shipping-rates',
        loadChildren: () =>
          import('./views/shipping-rates/shipping-rates.module').then(
            (m) => m.ShippingRatesModule
          ),
      },
      {
        path: 'tracking-page',
        loadChildren: () =>
          import('./views/tracking-page/tracking-page.module').then(
            (m) => m.TrackingPageModule
          ),
      },
      {
        path: 'image-display',
        loadChildren: () =>
          import('./views/image-display/image-display.module').then(
            (m) => m.ImageDisplayModule
          ),
      },
    ],
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
