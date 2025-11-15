import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { ApiService } from '../../services/api';
import { BreadcrumbComponent, BreadcrumbSegment } from '../../components/breadcrumb/breadcrumb';
import { BackButtonComponent } from '../../components/back-button/back-button';

@Component({
  selector: 'app-branches',
  imports: [UpperCasePipe, BreadcrumbComponent, BackButtonComponent],
  templateUrl: './branches.html',
  styleUrl: './branches.css',
})
export class Branches implements OnInit {

  branches: any[] = [];
  loading = true;
  breadcrumbs: BreadcrumbSegment[] = [];

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildBreadcrumbs();
    this.api.getBranches().subscribe((res: any) => {
      // Filter to show only branches with uppercase codes (which have subjects)
      // This is a temporary fix until database cleanup
      this.branches = res.filter((b: any) => b.code === b.code.toUpperCase());
      console.log('🔍 Filtered branches (uppercase only):', this.branches);
      this.loading = false;
    });
  }

  buildBreadcrumbs(): void {
    this.breadcrumbs = [
      { label: 'Branches' }
    ];
  }

  goToBranch(branch: any) {
    console.log('📍 Navigating to branch:', branch.code, 'ID:', branch.id);
    // Phase 2: Navigate to Regulations page instead of Years
    this.router.navigate(['/regulations', branch.id]);
  }
}
