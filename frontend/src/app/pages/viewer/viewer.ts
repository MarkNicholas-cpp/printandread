import { Component, OnInit } from '@angular/core';
import { TitleCasePipe, DatePipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService, Subject, Material } from '../../services/api';
import { SafeUrlPipe } from '../../pipes/safe-url-pipe';
import { BreadcrumbComponent, BreadcrumbSegment } from '../../components/breadcrumb/breadcrumb';
import { BackButtonComponent } from '../../components/back-button/back-button';

@Component({
  selector: 'app-viewer',
  imports: [TitleCasePipe, DatePipe, UpperCasePipe, SafeUrlPipe, BreadcrumbComponent, BackButtonComponent],
  templateUrl: './viewer.html',
  styleUrl: './viewer.css',
})
export class Viewer implements OnInit {

  material: Material | null = null;
  subject: Subject | null = null;
  loading = true;
  breadcrumbs: BreadcrumbSegment[] = [];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    const materialId = Number(this.route.snapshot.paramMap.get('materialId'));

    this.api.getMaterialById(materialId).subscribe({
      next: (material) => {
        this.material = material;
        // Fetch subject details for breadcrumbs and context
        if (material.subjectId) {
          this.api.getSubjectById(material.subjectId).subscribe({
            next: (subject) => {
              this.subject = subject;
              this.buildBreadcrumbs(subject, material);
              this.loading = false;
            },
            error: (err) => {
              console.error('Error fetching subject:', err);
              this.loading = false;
            }
          });
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error fetching material:', err);
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

