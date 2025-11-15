import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService, Semester, Regulation } from '../../services/api';
import { BreadcrumbComponent, BreadcrumbSegment } from '../../components/breadcrumb/breadcrumb';
import { BackButtonComponent } from '../../components/back-button/back-button';

@Component({
  selector: 'app-semesters',
  imports: [RouterLink, BreadcrumbComponent, BackButtonComponent],
  templateUrl: './semesters.html',
  styleUrl: './semesters.css',
})
export class Semesters implements OnInit {

  semesters: Semester[] = [];
  branchId!: number;
  regulationId!: number;
  yearId!: number;
  branch: any = null;
  regulation: Regulation | null = null;
  year: any = null;
  loading = true;
  breadcrumbs: BreadcrumbSegment[] = [];

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.branchId = Number(this.route.snapshot.paramMap.get('branchId'));
    this.regulationId = Number(this.route.snapshot.paramMap.get('regulationId'));
    this.yearId = Number(this.route.snapshot.paramMap.get('yearId'));

    // Fetch branch, regulation, and year for breadcrumbs
    this.api.getBranches().subscribe({
      next: (branches: any) => {
        this.branch = branches.find((b: any) => b.id === this.branchId);
        this.api.getRegulations().subscribe({
          next: (regulations) => {
            this.regulation = regulations.find((r: Regulation) => r.id === this.regulationId) || null;
            this.api.getYears().subscribe({
              next: (years: any) => {
                this.year = years.find((y: any) => y.id === this.yearId);
                this.buildBreadcrumbs();
              }
            });
          }
        });
      }
    });

    // Fetch semesters for the selected year
    this.api.getSemesters(this.yearId).subscribe({
      next: (semesters) => {
        this.semesters = semesters;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching semesters:', err);
        this.loading = false;
      }
    });
  }

  buildBreadcrumbs(): void {
    this.breadcrumbs = [
      { label: 'Branches', route: ['/branches'] },
      { label: this.branch?.code || 'Branch', route: ['/regulations', this.branchId.toString()] },
      { label: this.regulation?.code || 'Regulation', route: ['/years', this.branchId.toString(), this.regulationId.toString()] },
      { label: `Year ${this.year?.yearNumber || ''}`, route: ['/semesters', this.branchId.toString(), this.regulationId.toString(), this.yearId.toString()] }
    ];
  }

  goToSemester(semester: Semester) {
    // Navigate to Subjects page with all Phase 2 filters
    this.router.navigate(['/subjects', this.branchId, this.regulationId, this.yearId, semester.id]);
  }
}

