import { Component, OnInit } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Regulation, Semester } from '../../services/api';
import { StateService } from '../../services/state.service';
import { AccessTrackingService } from '../../services/access-tracking.service';
import { BreadcrumbComponent, BreadcrumbSegment } from '../../components/breadcrumb/breadcrumb';
import { BackButtonComponent } from '../../components/back-button/back-button';
import { GridSkeletonComponent } from '../../components/skeleton/grid-skeleton/grid-skeleton';
import { EmptyStateComponent } from '../../components/empty-state/empty-state';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-subjects',
  imports: [UpperCasePipe, BreadcrumbComponent, BackButtonComponent, GridSkeletonComponent, EmptyStateComponent],
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
    private state: StateService,
    private route: ActivatedRoute,
    private router: Router,
    private accessTracking: AccessTrackingService
  ) { }

  ngOnInit(): void {
    // Phase 2: Extract all route parameters
    this.branchId = Number(this.route.snapshot.paramMap.get('branchId'));
    this.regulationId = Number(this.route.snapshot.paramMap.get('regulationId'));
    this.yearId = Number(this.route.snapshot.paramMap.get('yearId'));
    this.semesterId = Number(this.route.snapshot.paramMap.get('semesterId'));

    // Load all required data from state (will use cache if available)
    forkJoin({
      branches: this.state.loadBranches(),
      regulations: this.state.loadRegulations(),
      years: this.state.loadYears(),
      semesters: this.state.loadSemesters(this.yearId),
      subjects: this.state.loadSubjects(this.branchId, this.regulationId, this.yearId, this.semesterId)
    }).subscribe({
      next: ({ branches, regulations, years, semesters, subjects }) => {
        // Set breadcrumb data
        this.branch = branches.find((b: any) => b.id === this.branchId);
        this.regulation = regulations.find((r: Regulation) => r.id === this.regulationId) || null;
        this.year = years.find((y: any) => y.id === this.yearId);
        this.semester = semesters.find((s: Semester) => s.id === this.semesterId) || null;
        this.buildBreadcrumbs();
        
        // Set subjects
        console.log('✅ Subjects fetched:', subjects.length, 'subjects found');
        this.subjects = subjects;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error fetching data:', err);
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
    // Track access
    this.accessTracking.trackAccess(subject.id, subject.name, 'subject', {
      branchId: this.branchId,
      regulationId: this.regulationId,
      yearId: this.yearId,
      semesterId: this.semesterId,
      subjectId: subject.id,
      code: subject.code
    });
    this.router.navigate(['/materials', subject.id]);
  }
}
