import { Component, OnInit } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService, Subject, Regulation, Semester } from '../../services/api';
import { BreadcrumbComponent, BreadcrumbSegment } from '../../components/breadcrumb/breadcrumb';
import { BackButtonComponent } from '../../components/back-button/back-button';

@Component({
  selector: 'app-subjects',
  imports: [UpperCasePipe, RouterLink, BreadcrumbComponent, BackButtonComponent],
  templateUrl: './subjects.html',
  styleUrl: './subjects.css',
})
export class Subjects implements OnInit {

  subjects: Subject[] = [];
  loading = true;
  branchId!: number;
  regulationId!: number;
  yearId!: number;
  semesterId!: number;
  branch: any = null;
  regulation: Regulation | null = null;
  year: any = null;
  semester: Semester | null = null;
  breadcrumbs: BreadcrumbSegment[] = [];

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Phase 2: Extract all route parameters
    this.branchId = Number(this.route.snapshot.paramMap.get('branchId'));
    this.regulationId = Number(this.route.snapshot.paramMap.get('regulationId'));
    this.yearId = Number(this.route.snapshot.paramMap.get('yearId'));
    this.semesterId = Number(this.route.snapshot.paramMap.get('semesterId'));

    // Fetch branch, regulation, year, and semester for breadcrumbs
    this.api.getBranches().subscribe({
      next: (branches: any) => {
        this.branch = branches.find((b: any) => b.id === this.branchId);
        this.api.getRegulations().subscribe({
          next: (regulations) => {
            this.regulation = regulations.find((r: Regulation) => r.id === this.regulationId) || null;
            this.api.getYears().subscribe({
              next: (years: any) => {
                this.year = years.find((y: any) => y.id === this.yearId);
                this.api.getSemesters(this.yearId).subscribe({
                  next: (semesters) => {
                    this.semester = semesters.find((s: Semester) => s.id === this.semesterId) || null;
                    this.buildBreadcrumbs();
                  }
                });
              }
            });
          }
        });
      }
    });

    // Phase 2: Use enhanced filter method
    this.api.getSubjectsWithFilters({
      branchId: this.branchId,
      regulationId: this.regulationId,
      yearId: this.yearId,
      semesterId: this.semesterId
    }).subscribe({
      next: (subjects) => {
        console.log('✅ Subjects fetched:', subjects.length, 'subjects found');
        console.log('📋 Subjects data:', subjects);
        this.subjects = subjects;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error fetching subjects:', err);
        console.error('🔍 Error details:', JSON.stringify(err, null, 2));
        this.loading = false;
      }
    });
  }

  buildBreadcrumbs(): void {
    this.breadcrumbs = [
      { label: 'Branches', route: ['/branches'] },
      { label: this.branch?.code || 'Branch', route: ['/regulations', this.branchId.toString()] },
      { label: this.regulation?.code || 'Regulation', route: ['/years', this.branchId.toString(), this.regulationId.toString()] },
      { label: `Year ${this.year?.yearNumber || ''}`, route: ['/semesters', this.branchId.toString(), this.regulationId.toString(), this.yearId.toString()] },
      { label: this.semester?.semesterDisplayName || 'Semester', route: ['/subjects', this.branchId.toString(), this.regulationId.toString(), this.yearId.toString(), this.semesterId.toString()] }
    ];
  }

  goToSubject(subject: Subject) {
    this.router.navigate(['/materials', subject.id]);
  }
}
