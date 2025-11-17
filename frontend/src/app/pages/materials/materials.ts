import { Component, OnInit } from '@angular/core';
import { TitleCasePipe, DatePipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Material } from '../../services/api';
import { StateService } from '../../services/state.service';
import { AccessTrackingService } from '../../services/access-tracking.service';
import { BreadcrumbComponent, BreadcrumbSegment } from '../../components/breadcrumb/breadcrumb';
import { BackButtonComponent } from '../../components/back-button/back-button';
import { GridSkeletonComponent } from '../../components/skeleton/grid-skeleton/grid-skeleton';
import { EmptyStateComponent } from '../../components/empty-state/empty-state';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-materials',
  imports: [TitleCasePipe, DatePipe, UpperCasePipe, BreadcrumbComponent, BackButtonComponent, GridSkeletonComponent, EmptyStateComponent],
  templateUrl: './materials.html',
  styleUrl: './materials.css',
})
export class Materials implements OnInit {

  materials: Material[] = [];
  subjectId!: number;
  subject: Subject | null = null;
  loading = true;
  error: string | null = null;
  breadcrumbs: BreadcrumbSegment[] = [];

  constructor(
    private state: StateService,
    private route: ActivatedRoute,
    private router: Router,
    private accessTracking: AccessTrackingService
  ) {}

  ngOnInit(): void {
    this.subjectId = Number(this.route.snapshot.paramMap.get('subjectId'));

    // Load subject and materials from state (will use cache if available)
    forkJoin({
      subject: this.state.loadSubjectById(this.subjectId),
      materials: this.state.loadMaterials(this.subjectId)
    }).subscribe({
      next: ({ subject, materials }) => {
        this.subject = subject;
        this.materials = materials;
        this.buildBreadcrumbs(subject);
        this.loading = false;
        this.error = null;
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.error = 'Failed to load data. Please try again later.';
        this.loading = false;
      }
    });
  }

  buildBreadcrumbs(subject: Subject): void {
    // We need to get IDs from the subject - but Subject interface doesn't have branchId/yearId/semesterId
    // We'll need to fetch them or use route params if available
    // For now, let's build breadcrumbs using the codes and names we have
    // The routes will need the IDs, so we'll need to enhance the Subject interface or fetch separately
    
    // Since we don't have branchId/yearId/semesterId in Subject, we'll make breadcrumbs non-clickable for now
    // Or we can fetch branch/year/semester separately - but that's too many API calls
    // Best solution: Enhance SubjectResponseDTO to include these IDs
    
    // For Sprint 1, let's use a simpler approach: make breadcrumbs show the path but only make "Branches" clickable
    // Users can use the back button for navigation
    this.breadcrumbs = [
      { label: subject.branchCode, route: ['/branches'] },
      { label: subject.regulationCode },
      { label: `Year ${subject.yearNumber}` },
      { label: subject.semesterDisplayName },
      { label: subject.name },
      { label: 'Materials' }
    ];
  }

  viewMaterial(material: Material) {
    // Track access
    this.accessTracking.trackAccess(material.id, material.title, 'material', {
      subjectId: this.subjectId,
      materialId: material.id
    });
    this.router.navigate(['/viewer', material.id.toString()]);
  }

  downloadMaterial(material: Material) {
    window.open(material.cloudinaryUrl, "_blank");
  }
}
