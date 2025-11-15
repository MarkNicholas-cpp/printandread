import { Component, OnInit } from '@angular/core';
import { TitleCasePipe, DatePipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService, Subject, Material } from '../../services/api';
import { BreadcrumbComponent, BreadcrumbSegment } from '../../components/breadcrumb/breadcrumb';
import { BackButtonComponent } from '../../components/back-button/back-button';

@Component({
  selector: 'app-materials',
  imports: [TitleCasePipe, DatePipe, UpperCasePipe, RouterLink, BreadcrumbComponent, BackButtonComponent],
  templateUrl: './materials.html',
  styleUrl: './materials.css',
})
export class Materials implements OnInit {

  materials: Material[] = [];
  subjectId!: number;
  subject: Subject | null = null;
  loading = true;
  breadcrumbs: BreadcrumbSegment[] = [];

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subjectId = Number(this.route.snapshot.paramMap.get('subjectId'));

    // Fetch subject details for breadcrumbs and context
    this.api.getSubjectById(this.subjectId).subscribe({
      next: (subject) => {
        this.subject = subject;
        this.buildBreadcrumbs(subject);
        // Then fetch materials
        this.api.getMaterials(this.subjectId).subscribe({
          next: (materials) => {
            this.materials = materials;
            this.loading = false;
          },
          error: (err) => {
            console.error('Error fetching materials:', err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error fetching subject:', err);
        // Still try to fetch materials even if subject fetch fails
        this.api.getMaterials(this.subjectId).subscribe({
          next: (materials) => {
            this.materials = materials;
            this.loading = false;
          },
          error: (err2) => {
            console.error('Error fetching materials:', err2);
            this.loading = false;
          }
        });
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
    this.router.navigate(['/viewer', material.id.toString()]);
  }

  downloadMaterial(material: Material) {
    window.open(material.cloudinaryUrl, "_blank");
  }
}
