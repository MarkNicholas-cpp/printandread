import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Regulation } from '../../services/api';
import { StateService } from '../../services/state.service';
import { AccessTrackingService } from '../../services/access-tracking.service';
import { BreadcrumbComponent, BreadcrumbSegment } from '../../components/breadcrumb/breadcrumb';
import { BackButtonComponent } from '../../components/back-button/back-button';
import { GridSkeletonComponent } from '../../components/skeleton/grid-skeleton/grid-skeleton';
import { EmptyStateComponent } from '../../components/empty-state/empty-state';

@Component({
  selector: 'app-regulations',
  imports: [BreadcrumbComponent, BackButtonComponent, GridSkeletonComponent, EmptyStateComponent],
  templateUrl: './regulations.html',
  styleUrl: './regulations.css',
})
export class Regulations implements OnInit {

  regulations: Regulation[] = [];
  branchId!: number;
  branch: any = null;
  loading = true;
  breadcrumbs: BreadcrumbSegment[] = [];

  constructor(
    private state: StateService,
    private route: ActivatedRoute,
    private router: Router,
    private accessTracking: AccessTrackingService
  ) { }

  ngOnInit(): void {
    this.branchId = Number(this.route.snapshot.paramMap.get('branchId'));

    // Fetch branch info for breadcrumbs from state
    this.state.loadBranches().subscribe({
      next: (branches: any) => {
        this.branch = branches.find((b: any) => b.id === this.branchId);
        this.buildBreadcrumbs();
      }
    });

    // Load regulations from state (will use cache if available)
    this.state.loadRegulations().subscribe({
      next: (regulations) => {
        this.regulations = regulations;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching regulations:', err);
        this.loading = false;
      }
    });
  }

  buildBreadcrumbs(): void {
    this.breadcrumbs = [
      { label: 'Branches', route: ['/branches'] },
      { label: this.branch?.code || 'Branch', route: ['/regulations', this.branchId.toString()] }
    ];
  }

  goToRegulation(regulation: Regulation) {
    // Track access
    this.accessTracking.trackAccess(regulation.id, regulation.name, 'regulation', {
      branchId: this.branchId,
      regulationId: regulation.id,
      code: regulation.code
    });
    // Navigate to Years page with branchId and regulationId
    this.router.navigate(['/years', this.branchId, regulation.id]);
  }

  getYearRange(regulation: Regulation): string {
    if (regulation.endYear) {
      return `${regulation.startYear}–${regulation.endYear}`;
    }
    return `${regulation.startYear}–Present`;
  }

  isLatest(regulation: Regulation): boolean {
    // Consider regulation with no endYear as latest
    return !regulation.endYear;
  }
}

