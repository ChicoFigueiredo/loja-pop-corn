import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametrosRoutingModule } from './parametros-routing.module';
import { CuponsComponent } from './cupons/cupons.component';
import { ThemeModule } from './../../@theme/theme.module';
import { UltraAdminService } from '../../services/ultra-admin.service';
import { ModalComponentEx } from './cupons/modal/modal-ex.component';

@NgModule({
  imports: [
    CommonModule,
    ParametrosRoutingModule,
    ThemeModule,
  ],
  providers: [
    UltraAdminService,
  ],
  entryComponents:[
    ModalComponentEx
  ],
  declarations: [
    CuponsComponent,
    ModalComponentEx
  ]
})
export class ParametrosModule { }
