import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Subject, Material, Branch } from '../../services/api';
import { TitleCasePipe, DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe, DatePipe, DecimalPipe],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  // Tab management
  activeTab: string = 'upload';

  // Upload Material Form data
  selectedSubjectId: number | null = null;
  materialType: string = 'notes';
  title: string = '';
  selectedFile: File | null = null;
  fileName: string = '';

  // Create Branch Form
  branchName: string = '';
  branchCode: string = '';

  // Create Regulation Form
  regulationName: string = '';
  regulationCode: string = '';
  regulationStartYear: number | null = null;
  regulationEndYear: number | null = null;
  regulationDescription: string = '';

  // Create Subject Form
  subjectName: string = '';
  subjectCode: string = '';
  subjectBranchId: number | null = null;
  subjectRegulationId: number | null = null;
  subjectYearId: number | null = null;
  subjectSemesterId: number | null = null;
  subjectSubBranchId: number | null = null;

  // Data
  subjects: Subject[] = [];
  uploadedMaterials: Material[] = [];
  filteredSubjects: Subject[] = [];
  subjectSearchQuery: string = '';
  years: any[] = [];
  regulations: any[] = [];
  branches: Branch[] = [];
  subBranches: any[] = [];
  semesters: any[] = [];

  // UI states
  loading = false;
  uploading = false;
  uploadProgress = 0;
  showSubjectDropdown = false;
  creating = false;
  error: string | null = null;
  success: string | null = null;

  // Material types
  materialTypes = [
    { value: 'notes', label: 'Notes' },
    { value: 'question-paper', label: 'Question Paper' },
    { value: 'syllabus', label: 'Syllabus' },
    { value: 'lab-manual', label: 'Lab Manual' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'reference', label: 'Reference Material' },
  ];

  constructor(
    private api: ApiService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.loadSubjects();
    this.loadUploadedMaterials();
    this.loadYears();
    this.loadRegulations();
    this.loadBranches();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.error = null;
    this.success = null;
  }

  loadSubjects(): void {
    this.loading = true;
    this.api.getSubjectsWithFilters({}).subscribe({
      next: (subjects: Subject[]) => {
        this.subjects = subjects;
        this.filteredSubjects = subjects;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading subjects:', err);
        this.error = 'Failed to load subjects. Please try again.';
        this.loading = false;
      }
    });
  }

  loadUploadedMaterials(): void {
    this.api.getAllMaterials().subscribe({
      next: (materials: Material[]) => {
        this.uploadedMaterials = materials.sort((a: Material, b: Material) =>
          new Date(b.uploadedOn).getTime() - new Date(a.uploadedOn).getTime()
        );
      },
      error: (err: any) => {
        console.error('Error loading uploaded materials:', err);
      }
    });
  }

  onSubjectSearch(): void {
    if (!this.subjectSearchQuery.trim()) {
      this.filteredSubjects = this.subjects;
      return;
    }

    const query = this.subjectSearchQuery.toLowerCase();
    this.filteredSubjects = this.subjects.filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.code.toLowerCase().includes(query) ||
      s.branchCode.toLowerCase().includes(query)
    );
  }

  selectSubject(subject: Subject): void {
    this.selectedSubjectId = subject.id;
    this.subjectSearchQuery = `${subject.name} (${subject.code})`;
    this.showSubjectDropdown = false;
    this.error = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        this.selectedFile = file;
        this.fileName = file.name;
        this.error = null;
      } else {
        this.error = 'Please select a PDF file.';
        this.selectedFile = null;
        this.fileName = '';
      }
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        this.selectedFile = file;
        this.fileName = file.name;
        this.error = null;
      } else {
        this.error = 'Please drop a PDF file.';
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDropZoneClick(): void {
    const fileInput = this.document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.fileName = '';
  }

  uploadMaterial(): void {
    // Validation
    if (!this.selectedSubjectId) {
      this.error = 'Please select a subject.';
      return;
    }

    if (!this.title.trim()) {
      this.error = 'Please enter a title for the material.';
      return;
    }

    if (!this.selectedFile) {
      this.error = 'Please select a PDF file to upload.';
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;
    this.error = null;
    this.success = null;

    // Create form data
    const formData = new FormData();
    const uploadRequest = {
      subjectId: this.selectedSubjectId,
      materialType: this.materialType,
      title: this.title.trim()
    };

    formData.append('data', JSON.stringify(uploadRequest));
    formData.append('file', this.selectedFile);

    // Simulate progress (since we can't track actual upload progress easily)
    const progressInterval = setInterval(() => {
      if (this.uploadProgress < 90) {
        this.uploadProgress += 10;
      }
    }, 200);

    this.api.uploadMaterial(formData).subscribe({
      next: (material: Material) => {
        clearInterval(progressInterval);
        this.uploadProgress = 100;

        // Reset form
        this.selectedSubjectId = null;
        this.subjectSearchQuery = '';
        this.materialType = 'notes';
        this.title = '';
        this.selectedFile = null;
        this.fileName = '';

        // Reload materials
        this.loadUploadedMaterials();

        this.success = `Successfully uploaded "${material.title}"!`;
        this.uploading = false;

        // Clear success message after 5 seconds
        setTimeout(() => {
          this.success = null;
        }, 5000);
      },
      error: (err: any) => {
        clearInterval(progressInterval);
        console.error('Upload error:', err);
        this.error = err.error?.message || 'Failed to upload material. Please try again.';
        this.uploading = false;
        this.uploadProgress = 0;
      }
    });
  }

  getSelectedSubjectName(): string {
    if (!this.selectedSubjectId) return '';
    const subject = this.subjects.find(s => s.id === this.selectedSubjectId);
    return subject ? `${subject.name} (${subject.code})` : '';
  }

  // Data loading methods
  loadYears(): void {
    this.api.getAllYears().subscribe({
      next: (years: any[]) => {
        this.years = years;
      },
      error: (err: any) => {
        console.error('Error loading years:', err);
      }
    });
  }

  loadRegulations(): void {
    this.api.getAllRegulations().subscribe({
      next: (regulations: any[]) => {
        this.regulations = regulations;
      },
      error: (err: any) => {
        console.error('Error loading regulations:', err);
      }
    });
  }

  loadBranches(): void {
    this.api.getBranches().subscribe({
      next: (branches: Branch[]) => {
        this.branches = branches.filter((b: Branch) => b.code === b.code.toUpperCase());
      },
      error: (err: any) => {
        console.error('Error loading branches:', err);
      }
    });
  }

  onSubjectBranchChange(): void {
    if (this.subjectBranchId) {
      this.api.getSubBranches(this.subjectBranchId).subscribe({
        next: (subBranches: any[]) => {
          this.subBranches = subBranches;
        },
        error: (err: any) => {
          console.error('Error loading sub-branches:', err);
        }
      });
    } else {
      this.subBranches = [];
    }
    this.subjectSubBranchId = null;
  }

  onYearSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.subjectYearId = value ? Number(value) : null;
    this.onSubjectYearChange();
  }

  onSubjectYearChange(): void {
    if (this.subjectYearId) {
      const yearId = Number(this.subjectYearId); // Ensure it's a number
      console.log('Loading semesters for yearId:', yearId, 'Type:', typeof yearId);
      this.api.getSemestersByYear(yearId).subscribe({
        next: (semesters: any[]) => {
          console.log('Semesters loaded:', semesters);
          // Map the response to include semesterDisplayName if it's missing
          this.semesters = (semesters || []).map((sem: any) => ({
            ...sem,
            semesterDisplayName: sem.semesterDisplayName || sem.displayName || `Semester ${sem.semNumber}`
          }));
          console.log('Mapped semesters:', this.semesters);
          if (this.semesters.length === 0) {
            console.warn('No semesters found for yearId:', yearId);
            this.error = 'No semesters found for the selected year. Please ensure semesters are created.';
          } else {
            this.error = null; // Clear error if semesters loaded successfully
          }
        },
        error: (err: any) => {
          console.error('Error loading semesters:', err);
          this.error = err.error?.message || 'Failed to load semesters. Please try again.';
          this.semesters = [];
        }
      });
    } else {
      this.semesters = [];
      this.error = null;
    }
    this.subjectSemesterId = null;
  }

  // Create methods
  createBranch(): void {
    if (!this.branchName.trim() || !this.branchCode.trim()) {
      this.error = 'Please fill in all required fields.';
      return;
    }

    this.creating = true;
    this.error = null;
    this.success = null;

    this.api.createBranch({
      name: this.branchName.trim(),
      code: this.branchCode.trim().toUpperCase()
    }).subscribe({
      next: (branch: any) => {
        this.success = `Successfully created branch "${branch.name}"!`;
        this.branchName = '';
        this.branchCode = '';
        this.creating = false;
        this.loadBranches(); // Reload branches after creation
        setTimeout(() => this.success = null, 5000);
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to create branch. Please try again.';
        this.creating = false;
      }
    });
  }

  createRegulation(): void {
    if (!this.regulationName.trim() || !this.regulationCode.trim() || !this.regulationStartYear) {
      this.error = 'Please fill in all required fields.';
      return;
    }

    this.creating = true;
    this.error = null;
    this.success = null;

    this.api.createRegulation({
      name: this.regulationName.trim(),
      code: this.regulationCode.trim().toUpperCase(),
      startYear: this.regulationStartYear!,
      endYear: this.regulationEndYear || undefined,
      description: this.regulationDescription.trim() || undefined
    }).subscribe({
      next: (regulation: any) => {
        this.success = `Successfully created regulation "${regulation.name}"! Years 1-4 and Semesters (2 per year: Year 1→Sem 1,2; Year 2→Sem 3,4; Year 3→Sem 5,6; Year 4→Sem 7,8) have been automatically created.`;
        this.regulationName = '';
        this.regulationCode = '';
        this.regulationStartYear = null;
        this.regulationEndYear = null;
        this.regulationDescription = '';
        this.creating = false;
        this.loadRegulations();
        this.loadYears(); // Reload years after regulation creation
        setTimeout(() => this.success = null, 7000);
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to create regulation. Please try again.';
        this.creating = false;
      }
    });
  }

  createSubject(): void {
    if (!this.subjectName.trim() || !this.subjectCode.trim() || !this.subjectBranchId ||
      !this.subjectRegulationId || !this.subjectYearId || !this.subjectSemesterId) {
      this.error = 'Please fill in all required fields.';
      return;
    }

    this.creating = true;
    this.error = null;
    this.success = null;

    this.api.createSubject({
      name: this.subjectName.trim(),
      code: this.subjectCode.trim().toUpperCase(),
      branchId: this.subjectBranchId,
      regulationId: this.subjectRegulationId,
      yearId: this.subjectYearId,
      semesterId: this.subjectSemesterId,
      subBranchId: this.subjectSubBranchId || undefined
    }).subscribe({
      next: (subject: any) => {
        this.success = `Successfully created subject "${subject.name}"!`;
        this.subjectName = '';
        this.subjectCode = '';
        this.subjectBranchId = null;
        this.subjectRegulationId = null;
        this.subjectYearId = null;
        this.subjectSemesterId = null;
        this.subjectSubBranchId = null;
        this.subBranches = [];
        this.semesters = [];
        this.creating = false;
        this.loadSubjects();
        setTimeout(() => this.success = null, 5000);
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to create subject. Please try again.';
        this.creating = false;
      }
    });
  }
}

