import { Component, OnInit } from '@angular/core';
import { TitleCasePipe, DatePipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, Material } from '../../services/api';
import { StateService } from '../../services/state.service';
import { AccessTrackingService } from '../../services/access-tracking.service';
import { SafeUrlPipe } from '../../pipes/safe-url-pipe';
import { BreadcrumbComponent, BreadcrumbSegment } from '../../components/breadcrumb/breadcrumb';
import { BackButtonComponent } from '../../components/back-button/back-button';
import { ViewerSkeletonComponent } from '../../components/skeleton/viewer-skeleton/viewer-skeleton';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-viewer',
  imports: [TitleCasePipe, DatePipe, UpperCasePipe, SafeUrlPipe, BreadcrumbComponent, BackButtonComponent, ViewerSkeletonComponent],
  templateUrl: './viewer.html',
  styleUrl: './viewer.css',
})
export class Viewer implements OnInit {

  material: Material | null = null;
  subject: Subject | null = null;
  loading = true;
  error: string | null = null;
  breadcrumbs: BreadcrumbSegment[] = [];

  constructor(
    private route: ActivatedRoute,
    private state: StateService,
    private accessTracking: AccessTrackingService
  ) { }

  ngOnInit(): void {
    const materialId = Number(this.route.snapshot.paramMap.get('materialId'));

    // Load material from state (will use cache if available)
    this.state.loadMaterialById(materialId).subscribe({
      next: (material) => {
        this.material = material;
        this.error = null;
        
        // Fetch subject details for breadcrumbs and context
        if (material.subjectId) {
          this.state.loadSubjectById(material.subjectId).subscribe({
            next: (subject) => {
              this.subject = subject;
              this.buildBreadcrumbs(subject, material);
              
              // Track access to branch and regulation only (not material)
              // Load branches and regulations from state
              forkJoin({
                branches: this.state.loadBranches(),
                regulations: this.state.loadRegulations()
              }).subscribe({
                next: ({ branches, regulations }) => {
                  const branch = branches.find((b: any) => b.code === subject.branchCode);
                  const regulation = regulations.find((r: any) => r.id === subject.regulationId);
                  
                  if (branch) {
                    // Track branch access
                    this.accessTracking.trackAccess(branch.id, branch.name, 'branch', {
                      branchId: branch.id
                    });
                  }
                  
                  if (regulation && branch) {
                    // Track regulation access
                    this.accessTracking.trackAccess(regulation.id, regulation.name, 'regulation', {
                      branchId: branch.id,
                      regulationId: regulation.id,
                      code: regulation.code
                    });
                  }
                },
                error: (err) => {
                  console.error('Error loading branches/regulations for tracking:', err);
                }
              });
              
              // Save to localStorage for "Continue Learning" (Zeigarnik Effect)
              localStorage.setItem('lastViewedMaterial', JSON.stringify({
                id: material.id,
                title: material.title,
                subjectId: material.subjectId,
                timestamp: new Date().toISOString()
              }));
              
              this.loading = false;
            },
            error: (err) => {
              console.error('Error fetching subject:', err);
              this.error = 'Failed to load subject details.';
              this.loading = false;
            }
          });
        } else {
          // No subject available, so we can't track branch/regulation
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error fetching material:', err);
        this.error = 'Failed to load material. Please check the URL and try again.';
        this.loading = false;
      }
    });
  }

  buildBreadcrumbs(subject: Subject, material: Material): void {
    this.breadcrumbs = [
      { label: subject.branchCode, route: ['/branches'] },
      { label: subject.regulationCode },
      { label: `Year ${subject.yearNumber}` },
      { label: subject.semesterDisplayName },
      { label: subject.name, route: ['/materials', subject.id.toString()] },
      { label: material.title }
    ];
  }

}

