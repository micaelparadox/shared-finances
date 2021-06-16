import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoService } from '@ngneat/transloco';
import { take } from 'rxjs/operators';
import { Category } from 'src/app/@core/models';
import { ErrorService } from 'src/app/@core/services/error.service';
import { GenericCategoryService } from '../generic-category.service';
import { GENERIC_CATEGORY_URL_TOKEN } from '..';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss'],
})
export class NewCategoryComponent implements OnInit {
  get individualSharedBreadcrumbUrl() {
    const urls = this.categoryUrl.split('/').slice(0, 3);
    urls[0] = '/' + urls[0];
    return urls;
  }

  get isIndividual() {
    return this.categoryUrl.includes('/single/');
  }

  get categoriesBreadcrumbUrl() {
    return this.categoryUrl;
  }

  constructor(
    private categoryService: GenericCategoryService,
    private router: Router,
    private toast: HotToastService,
    private translocoService: TranslocoService,
    private errorService: ErrorService,
    @Inject(GENERIC_CATEGORY_URL_TOKEN) private categoryUrl: string,
  ) {}

  ngOnInit(): void {}

  async newCategory(categoryInput: Category): Promise<void> {
    await this.categoryService
      .newCategory(categoryInput)
      .pipe(
        take(1),
        this.toast.observe({
          loading: this.translocoService.translate('creating'),
          success: this.translocoService.translate('creating-successful', { name: categoryInput.name }),
          error: error =>
            this.errorService.getInstantErrorMessage(error, 'creating-error', 'creating-error-with-description', {
              name: categoryInput.name,
            }),
        }),
      )
      .toPromise();

    this.router.navigateByUrl(this.categoryUrl);
  }
}