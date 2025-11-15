import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService, Regulation } from '../../services/api';
import { BreadcrumbComponent, BreadcrumbSegment } from '../../components/breadcrumb/breadcrumb';
import { BackButtonComponent } from '../../components/back-button/back-button';

@Component({
  selector: 'app-regulations',
  imports: [RouterLink, BreadcrumbComponent, BackButtonComponent],
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
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.branchId = Number(this.route.snapshot.paramMap.get('branchId'));

    // Fetch branch info for breadcrumbs
    this.api.getBranches().subscribe({
      next: (branches: any) => {
        this.branch = branches.find((b: any) => b.id === this.branchId);
        this.buildBreadcrumbs();
      }
    });

    this.api.getRegulations().subscribe({
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

