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

export interface Branch {
  id: number;
  name: string;
  code: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Phase 1 APIs (Legacy - kept for backward compatibility)
  getBranches() {
    return this.http.get<Branch[]>(`${this.base}/branches`);
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

  // Get recent materials (for Home page)
  getRecentMaterials(limit: number = 10) {
    return this.http.get<Material[]>(`${this.base}/materials/recent?limit=${limit}`);
  }

  // Global search
  search(query: string) {
    return this.http.get<{
      subjects: Subject[];
      materials: Material[];
      branches: Branch[];
      regulations: Regulation[];
      query: string;
    }>(`${this.base}/search?q=${encodeURIComponent(query)}`);
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

  // Admin APIs
  getAllMaterials() {
    return this.http.get<Material[]>(`${this.base}/materials`);
  }

  uploadMaterial(formData: FormData) {
    return this.http.post<Material>(`${this.base}/materials/upload`, formData, {
      reportProgress: true,
    });
  }

  // Create Year
  createYear(yearNumber: number) {
    return this.http.post<any>(`${this.base}/years`, { yearNumber });
  }

  // Create Branch
  createBranch(data: { name: string; code: string }) {
    return this.http.post<Branch>(`${this.base}/branches`, data);
  }

  // Create Regulation
  createRegulation(data: { name: string; code: string; startYear: number; endYear?: number; description?: string }) {
    return this.http.post<Regulation>(`${this.base}/regulations`, data);
  }

  // Create Subject
  createSubject(data: { name: string; code: string; branchId: number; regulationId: number; yearId: number; semesterId: number; subBranchId?: number }) {
    return this.http.post<Subject>(`${this.base}/subjects`, data);
  }

  // Get all years
  getAllYears() {
    return this.http.get<any[]>(`${this.base}/years`);
  }

  // Get all regulations
  getAllRegulations() {
    return this.http.get<Regulation[]>(`${this.base}/regulations`);
  }

  // Get semesters by year
  getSemestersByYear(yearId: number) {
    return this.http.get<any[]>(`${this.base}/semesters/year/${yearId}`);
  }
}
