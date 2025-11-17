import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService, Branch, Regulation, Subject, Material, Semester, SubBranch } from './api';

export interface AppState {
    branches: Branch[];
    regulations: Regulation[];
    years: any[];
    semesters: { [yearId: number]: Semester[] };
    subjects: { [key: string]: Subject[] }; // Key format: "branchId-regulationId-yearId-semesterId"
    materials: { [subjectId: number]: Material[] };
    subBranches: { [branchId: number]: SubBranch[] };
    materialsById: { [materialId: number]: Material };
    subjectsById: { [subjectId: number]: Subject };
}

@Injectable({
    providedIn: 'root'
})
export class StateService {
    private initialState: AppState = {
        branches: [],
        regulations: [],
        years: [],
        semesters: {},
        subjects: {},
        materials: {},
        subBranches: {},
        materialsById: {},
        subjectsById: {}
    };

    private state$ = new BehaviorSubject<AppState>(this.initialState);
    public readonly state = this.state$.asObservable();

    // Loading states
    private loadingStates$ = new BehaviorSubject<{
        branches: boolean;
        regulations: boolean;
        years: boolean;
        [key: string]: boolean;
    }>({
        branches: false,
        regulations: false,
        years: false
    });
    public readonly loadingStates = this.loadingStates$.asObservable();

    constructor(private api: ApiService) { }

    // ============================================
    // GETTERS - Get current state synchronously
    // ============================================

    getCurrentState(): AppState {
        return this.state$.getValue();
    }

    getBranches(): Branch[] {
        return this.getCurrentState().branches;
    }

    getRegulations(): Regulation[] {
        return this.getCurrentState().regulations;
    }

    getYears(): any[] {
        return this.getCurrentState().years;
    }

    getSemesters(yearId: number): Semester[] {
        return this.getCurrentState().semesters[yearId] || [];
    }

    getSubjects(branchId: number, regulationId: number, yearId: number, semesterId: number): Subject[] {
        const key = `${branchId}-${regulationId}-${yearId}-${semesterId}`;
        return this.getCurrentState().subjects[key] || [];
    }

    getMaterials(subjectId: number): Material[] {
        return this.getCurrentState().materials[subjectId] || [];
    }

    getSubBranches(branchId: number): SubBranch[] {
        return this.getCurrentState().subBranches[branchId] || [];
    }

    getMaterialById(materialId: number): Material | null {
        return this.getCurrentState().materialsById[materialId] || null;
    }

    getSubjectById(subjectId: number): Subject | null {
        return this.getCurrentState().subjectsById[subjectId] || null;
    }

    // ============================================
    // OBSERVABLES - Get state as Observable
    // ============================================

    getBranches$(): Observable<Branch[]> {
        return this.state$.pipe(map(state => state.branches));
    }

    getRegulations$(): Observable<Regulation[]> {
        return this.state$.pipe(map(state => state.regulations));
    }

    getYears$(): Observable<any[]> {
        return this.state$.pipe(map(state => state.years));
    }

    getSemesters$(yearId: number): Observable<Semester[]> {
        return this.state$.pipe(map(state => state.semesters[yearId] || []));
    }

    getSubjects$(branchId: number, regulationId: number, yearId: number, semesterId: number): Observable<Subject[]> {
        const key = `${branchId}-${regulationId}-${yearId}-${semesterId}`;
        return this.state$.pipe(map(state => state.subjects[key] || []));
    }

    getMaterials$(subjectId: number): Observable<Material[]> {
        return this.state$.pipe(map(state => state.materials[subjectId] || []));
    }

    getSubBranches$(branchId: number): Observable<SubBranch[]> {
        return this.state$.pipe(map(state => state.subBranches[branchId] || []));
    }

    // ============================================
    // LOADERS - Load data from API if not in state
    // ============================================

    loadBranches(forceRefresh: boolean = false): Observable<Branch[]> {
        const currentBranches = this.getBranches();

        if (!forceRefresh && currentBranches.length > 0) {
            return of(currentBranches);
        }

        this.setLoading('branches', true);
        return this.api.getBranches().pipe(
            tap(branches => {
                this.updateState({ branches });
                this.setLoading('branches', false);
            })
        );
    }

    loadRegulations(forceRefresh: boolean = false): Observable<Regulation[]> {
        const currentRegulations = this.getRegulations();

        if (!forceRefresh && currentRegulations.length > 0) {
            return of(currentRegulations);
        }

        this.setLoading('regulations', true);
        return this.api.getRegulations().pipe(
            tap(regulations => {
                this.updateState({ regulations });
                this.setLoading('regulations', false);
            })
        );
    }

    loadYears(forceRefresh: boolean = false): Observable<any[]> {
        const currentYears = this.getYears();

        if (!forceRefresh && currentYears.length > 0) {
            return of(currentYears);
        }

        this.setLoading('years', true);
        return this.api.getAllYears().pipe(
            tap(years => {
                this.updateState({ years });
                this.setLoading('years', false);
            })
        );
    }

    loadSemesters(yearId: number, forceRefresh: boolean = false): Observable<Semester[]> {
        const currentSemesters = this.getSemesters(yearId);

        if (!forceRefresh && currentSemesters.length > 0) {
            return of(currentSemesters);
        }

        this.setLoading(`semesters-${yearId}`, true);
        return this.api.getSemestersByYear(yearId).pipe(
            tap(semesters => {
                const newState = { ...this.getCurrentState() };
                newState.semesters[yearId] = semesters;
                this.updateState(newState);
                this.setLoading(`semesters-${yearId}`, false);
            })
        );
    }

    loadSubjects(
        branchId: number,
        regulationId: number,
        yearId: number,
        semesterId: number,
        forceRefresh: boolean = false
    ): Observable<Subject[]> {
        const currentSubjects = this.getSubjects(branchId, regulationId, yearId, semesterId);

        if (!forceRefresh && currentSubjects.length > 0) {
            return of(currentSubjects);
        }

        const key = `subjects-${branchId}-${regulationId}-${yearId}-${semesterId}`;
        this.setLoading(key, true);

        return this.api.getSubjectsWithFilters({
            branchId,
            regulationId,
            yearId,
            semesterId
        }).pipe(
            tap(subjects => {
                const cacheKey = `${branchId}-${regulationId}-${yearId}-${semesterId}`;
                const newState = { ...this.getCurrentState() };
                newState.subjects[cacheKey] = subjects;

                // Also cache individual subjects by ID
                subjects.forEach(subject => {
                    newState.subjectsById[subject.id] = subject;
                });

                this.updateState(newState);
                this.setLoading(key, false);
            })
        );
    }

    loadMaterials(subjectId: number, forceRefresh: boolean = false): Observable<Material[]> {
        const currentMaterials = this.getMaterials(subjectId);

        if (!forceRefresh && currentMaterials.length > 0) {
            return of(currentMaterials);
        }

        this.setLoading(`materials-${subjectId}`, true);
        return this.api.getMaterials(subjectId).pipe(
            tap(materials => {
                const newState = { ...this.getCurrentState() };
                newState.materials[subjectId] = materials;

                // Also cache individual materials by ID
                materials.forEach(material => {
                    newState.materialsById[material.id] = material;
                });

                this.updateState(newState);
                this.setLoading(`materials-${subjectId}`, false);
            })
        );
    }

    loadSubBranches(branchId: number, forceRefresh: boolean = false): Observable<SubBranch[]> {
        const currentSubBranches = this.getSubBranches(branchId);

        if (!forceRefresh && currentSubBranches.length > 0) {
            return of(currentSubBranches);
        }

        this.setLoading(`subBranches-${branchId}`, true);
        return this.api.getSubBranches(branchId).pipe(
            tap(subBranches => {
                const newState = { ...this.getCurrentState() };
                newState.subBranches[branchId] = subBranches;
                this.updateState(newState);
                this.setLoading(`subBranches-${branchId}`, false);
            })
        );
    }

    loadMaterialById(materialId: number, forceRefresh: boolean = false): Observable<Material> {
        const currentMaterial = this.getMaterialById(materialId);

        if (!forceRefresh && currentMaterial) {
            return of(currentMaterial);
        }

        this.setLoading(`material-${materialId}`, true);
        return this.api.getMaterialById(materialId).pipe(
            tap(material => {
                const newState = { ...this.getCurrentState() };
                newState.materialsById[material.id] = material;
                this.updateState(newState);
                this.setLoading(`material-${materialId}`, false);
            })
        );
    }

    loadSubjectById(subjectId: number, forceRefresh: boolean = false): Observable<Subject> {
        const currentSubject = this.getSubjectById(subjectId);

        if (!forceRefresh && currentSubject) {
            return of(currentSubject);
        }

        this.setLoading(`subject-${subjectId}`, true);
        return this.api.getSubjectById(subjectId).pipe(
            tap(subject => {
                const newState = { ...this.getCurrentState() };
                newState.subjectsById[subject.id] = subject;
                this.updateState(newState);
                this.setLoading(`subject-${subjectId}`, false);
            })
        );
    }

    // ============================================
    // UPDATERS - Update state directly
    // ============================================

    updateState(partialState: Partial<AppState>): void {
        const currentState = this.getCurrentState();
        const newState = { ...currentState, ...partialState };
        this.state$.next(newState);
    }

    addMaterial(material: Material): void {
        const newState = { ...this.getCurrentState() };
        newState.materialsById[material.id] = material;

        // Add to subject's materials array if subjectId exists
        if (material.subjectId) {
            if (!newState.materials[material.subjectId]) {
                newState.materials[material.subjectId] = [];
            }
            // Check if material already exists
            const exists = newState.materials[material.subjectId].some(m => m.id === material.id);
            if (!exists) {
                newState.materials[material.subjectId] = [...newState.materials[material.subjectId], material];
            }
        }

        this.updateState(newState);
    }

    addSubject(subject: Subject): void {
        const newState = { ...this.getCurrentState() };
        newState.subjectsById[subject.id] = subject;
        this.updateState(newState);
    }

    // ============================================
    // CLEARERS - Clear specific parts of state
    // ============================================

    clearSubjects(): void {
        this.updateState({ subjects: {} });
    }

    clearMaterials(): void {
        this.updateState({ materials: {}, materialsById: {} });
    }

    clearAll(): void {
        this.state$.next(this.initialState);
    }

    // ============================================
    // LOADING STATE MANAGEMENT
    // ============================================

    isLoading(key: string): boolean {
        return this.loadingStates$.getValue()[key] || false;
    }

    getLoadingState$(key: string): Observable<boolean> {
        return this.loadingStates$.pipe(
            map(states => states[key] || false)
        );
    }

    private setLoading(key: string, loading: boolean): void {
        const currentStates = this.loadingStates$.getValue();
        this.loadingStates$.next({ ...currentStates, [key]: loading });
    }
}

