import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

// TypeScript interfaces for Phase 2
export interface Regulation {
  id: number;
  name: string;
  code: string;
  startYear: number;
  endYear?: number;
  description?: string;
}

export interface Semester {
  id: number;
  semNumber: number;
  semesterDisplayName: string;
  yearId: number;
  yearNumber: number;
}

export interface SubBranch {
  id: number;
  name: string;
  code: string;
  branchId: number;
  branchName: string;
  branchCode: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  branchCode: string;
  branchName: string;
  yearNumber: number;
  semNumber: number;
  semesterDisplayName: string;
  regulationId: number;
  regulationCode: string;
  regulationName: string;
  subBranchId?: number;
  subBranchCode?: string;
  subBranchName?: string;
  materialCount: number;
}

export interface SubjectFilters {
  branchId?: number;
  regulationId?: number;
  subBranchId?: number;
  yearId?: number;
  semesterId?: number;
}

export interface Material {
  id: number;
  title: string;
  materialType: string;
  cloudinaryUrl: string;
  uploadedOn: string;
  subjectName: string;
  subjectId: number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Phase 1 APIs (Legacy - kept for backward compatibility)
  getBranches() {
    return this.http.get(`${this.base}/branches`);
  }

  getYears() {
    return this.http.get(`${this.base}/years`);
  }

  getSubjects(branchId: number, yearId: number) {
    return this.http.get(`${this.base}/subjects?branchId=${branchId}&yearId=${yearId}`);
  }

  getMaterials(subjectId: number) {
    return this.http.get<Material[]>(`${this.base}/materials?subjectId=${subjectId}`);
  }

  getMaterialById(id: number) {
    return this.http.get<Material>(`${this.base}/materials/${id}`);
  }

  // Phase 2 APIs - Regulation
  getRegulations() {
    return this.http.get<Regulation[]>(`${this.base}/regulations`);
  }

  getRegulationById(id: number) {
    return this.http.get<Regulation>(`${this.base}/regulations/${id}`);
  }

  getRegulationByCode(code: string) {
    return this.http.get<Regulation>(`${this.base}/regulations/code/${code}`);
  }

  // Phase 2 APIs - Semester
  getSemesters(yearId: number) {
    return this.http.get<Semester[]>(`${this.base}/semesters/year/${yearId}`);
  }

  getSemestersByYearId(yearId: number) {
    return this.getSemesters(yearId);
  }

  getSemestersByYearNumber(yearNumber: number) {
    return this.http.get<Semester[]>(`${this.base}/semesters/year-number/${yearNumber}`);
  }

  // Phase 2 APIs - SubBranch
  getSubBranches(branchId?: number) {
    const url = branchId 
      ? `${this.base}/sub-branches?branchId=${branchId}`
      : `${this.base}/sub-branches`;
    return this.http.get<SubBranch[]>(url);
  }

  getSubBranchById(id: number) {
    return this.http.get<SubBranch>(`${this.base}/sub-branches/${id}`);
  }

  // Phase 2 APIs - Enhanced Subject with Filters
  getSubjectsWithFilters(filters: SubjectFilters) {
    const params = new URLSearchParams();
    if (filters.branchId) params.append('branchId', filters.branchId.toString());
    if (filters.regulationId) params.append('regulationId', filters.regulationId.toString());
    if (filters.subBranchId) params.append('subBranchId', filters.subBranchId.toString());
    if (filters.yearId) params.append('yearId', filters.yearId.toString());
    if (filters.semesterId) params.append('semesterId', filters.semesterId.toString());
    
    const url = `${this.base}/subjects?${params.toString()}`;
    console.log('🌐 API Call:', url);
    console.log('📊 Filters:', filters);
    
    return this.http.get<Subject[]>(url);
  }

  // Get subject by ID (for breadcrumbs and context)
  getSubjectById(id: number) {
    return this.http.get<Subject>(`${this.base}/subjects/${id}`);
  }
}
