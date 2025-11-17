import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Regulation } from '../../services/api';
import { BreadcrumbComponent, BreadcrumbSegment } from '../../components/breadcrumb/breadcrumb';
import { BackButtonComponent } from '../../components/back-button/back-button';
import { GridSkeletonComponent } from '../../components/skeleton/grid-skeleton/grid-skeleton';
import { EmptyStateComponent } from '../../components/empty-state/empty-state';

@Component({
  selector: 'app-years',
  imports: [BreadcrumbComponent, BackButtonComponent, GridSkeletonComponent, EmptyStateComponent],
  templateUrl: './years.html',
  styleUrl: './years.css',
})
export class Years implements OnInit {

  years: any[] = [];
  branchId!: number;
  regulationId!: number;
  branch: any = null;
  regulation: Regulation | null = null;
  loading = true;
  breadcrumbs: BreadcrumbSegment[] = [];

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.branchId = Number(this.route.snapshot.paramMap.get('branchId'));
    this.regulationId = Number(this.route.snapshot.paramMap.get('regulationId'));

    // Fetch branch and regulation for breadcrumbs
    this.api.getBranches().subscribe({
      next: (branches: any) => {
        this.branch = branches.find((b: any) => b.id === this.branchId);
        this.api.getRegulations().subscribe({
          next: (regulations) => {
            this.regulation = regulations.find((r: Regulation) => r.id === this.regulationId) || null;
            this.buildBreadcrumbs();
          }
        });
      }
    });

    this.api.getYears().subscribe((res: any) => {
      this.years = res;
      this.loading = false;
    });
  }

  buildBreadcrumbs(): void {
    this.breadcrumbs = [
      { label: 'Branches', route: ['/branches'] },
      { label: this.branch?.code || 'Branch', route: ['/regulations', this.branchId.toString()] },
      { label: this.regulation?.code || 'Regulation', route: ['/years', this.branchId.toString(), this.regulationId.toString()] }
    ];
  }

  goToYear(year: any) {
    // Phase 2: Navigate to Semesters page with branchId, regulationId, and yearId
    this.router.navigate(['/semesters', this.branchId, this.regulationId, year.id]);
  }
}
