import { NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import {
  DetailProductComponent
} from './components/detail-product/detail-product.component';
import { OrderComponent } from './components/order/order.component';
import { OrderDetailComponent } from './components/detail-order/order.detail.component';
import { UserProfileComponent } from './components/user-profile/user.profile.component';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuardFn } from './guards/auth.guard';
import { AdminGuardFn } from './guards/admin.guard';
import { UserLayoutComponent } from './components/user-layout/user-layout.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { OrderAdminComponent } from './components/admin/order/order.admin.component';
import { DetailOrderAdminComponent } from './components/admin/detail-order/detail.order.admin.component';
import { ProductAdminComponent } from './components/admin/product/product.admin.component';
import { CategoryAdminComponent } from './components/admin/category/category.admin.component';
import { UpdateProductAdminComponent } from './components/admin/product/update/update.product.admin.component';
import { InsertProductAdminComponent } from './components/admin/product/insert/insert.product.admin.component';
import { InsertCategoryAdminComponent } from './components/admin/category/insert/insert.category.admin.component';
import { UpdateCategoryAdminComponent } from './components/admin/category/update/update.category.admin.component';
import { UserAdminComponent } from './components/admin/user/user.admin.component';

export const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'products/:id', component: DetailProductComponent },
      { path: 'orders', component: OrderComponent, canActivate: [AuthGuardFn] },
      { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardFn] },
      { path: 'user-orders', component: UserOrdersComponent, canActivate: [AuthGuardFn] },
      { path: 'orders/:id', component: OrderDetailComponent },
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuardFn],
    children: [
      { path: '', component: AdminComponent },
      { path: 'orders', component: OrderAdminComponent },
      { path: 'products', component: ProductAdminComponent },
      { path: 'categories', component: CategoryAdminComponent },
      { path: 'users', component: UserAdminComponent },
      { path: 'orders/:id', component: DetailOrderAdminComponent },
      { path: 'products/update/:id', component: UpdateProductAdminComponent },
      { path: 'products/insert', component: InsertProductAdminComponent },
      { path: 'categories/update/:id', component: UpdateCategoryAdminComponent },
      { path: 'categories/insert', component: InsertCategoryAdminComponent },
    ]
  }
];
