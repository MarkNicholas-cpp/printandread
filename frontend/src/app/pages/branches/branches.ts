import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { StateService } from '../../services/state.service';
import { AccessTrackingService } from '../../services/access-tracking.service';
import { BreadcrumbComponent, BreadcrumbSegment } from '../../components/breadcrumb/breadcrumb';
import { BackButtonComponent } from '../../components/back-button/back-button';
import { GridSkeletonComponent } from '../../components/skeleton/grid-skeleton/grid-skeleton';
import { EmptyStateComponent } from '../../components/empty-state/empty-state';

@Component({
  selector: 'app-branches',
  imports: [UpperCasePipe, BreadcrumbComponent, BackButtonComponent, GridSkeletonComponent, EmptyStateComponent],
  templateUrl: './branches.html',
  styleUrl: './branches.css',
})
export class Branches implements OnInit {

  branches: any[] = [];
  loading = true;
  error: string | null = null;
  breadcrumbs: BreadcrumbSegment[] = [];

  constructor(
    private state: StateService,
    private router: Router,
    private accessTracking: AccessTrackingService
  ) {}

  ngOnInit(): void {
    this.buildBreadcrumbs();
    
    // Use state service - will load from cache or API
    this.state.loadBranches().subscribe({
      next: (branches) => {
        // Filter to show only branches with uppercase codes (which have subjects)
        // This is a temporary fix until database cleanup
        this.branches = branches.filter((b: any) => b.code === b.code.toUpperCase());
        console.log('🔍 Filtered branches (uppercase only):', this.branches);
        this.loading = false;
        this.error = null;
      },
      error: (err) => {
        console.error('Error fetching branches:', err);
        this.error = 'Failed to load branches. Please try again later.';
        this.loading = false;
      }
    });
  }

  buildBreadcrumbs(): void {
    this.breadcrumbs = [
      { label: 'Branches' }
    ];
  }

  goToBranch(branch: any) {
    console.log('📍 Navigating to branch:', branch.code, 'ID:', branch.id);
    // Track access
    this.accessTracking.trackAccess(branch.id, branch.name, 'branch', {
      branchId: branch.id
    });
    // Phase 2: Navigate to Regulations page instead of Years
    this.router.navigate(['/regulations', branch.id]);
  }
}
