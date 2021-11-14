import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ProfileFavoritesComponent } from './profile-favorites/profile-favorites.component';
import { SharedModule } from '../SharedModule/shared.module';
import { ArticleHomeComponent } from 'src/core/components/article-home/article-home.component';
import { HomeModule } from '../HomeModule/home.module';

@NgModule({
  declarations: [ProfileComponent, ProfileFavoritesComponent],
  imports: [CommonModule, ProfileRoutingModule, SharedModule, HomeModule],
  exports: [SharedModule]
})
export class ProfileModule {}
