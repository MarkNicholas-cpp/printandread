import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ApiService, Material, Subject, Regulation, Branch } from '../../services/api';
import { GridSkeletonComponent } from '../../components/skeleton/grid-skeleton/grid-skeleton';
import { EmptyStateComponent } from '../../components/empty-state/empty-state';

export interface SearchResults {
  subjects: Subject[];
  materials: Material[];
  branches: Branch[];
  regulations: Regulation[];
  query: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, GridSkeletonComponent, EmptyStateComponent],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  searchQuery: string = '';
  results: SearchResults = {
    subjects: [],
    materials: [],
    branches: [],
    regulations: [],
    query: ''
  };
  loading = false;
  hasSearched = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const query = params['q'];
      if (query) {
        this.searchQuery = query;
        this.performSearch(query);
      }
    });
  }

  performSearch(query: string): void {
    if (!query || !query.trim()) {
      return;
    }

    this.loading = true;
    this.hasSearched = true;

    this.api.search(query).subscribe({
      next: (results: SearchResults) => {
        this.results = results;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error performing search:', err);
        this.loading = false;
      }
    });
  }

  navigateToSubject(subject: Subject): void {
    this.router.navigate(['/materials', subject.id]);
  }

  navigateToMaterial(material: Material): void {
    this.router.navigate(['/viewer', material.id]);
  }

  navigateToBranch(branch: Branch): void {
    this.router.navigate(['/regulations', branch.id]);
  }

  navigateToRegulation(regulation: Regulation): void {
    // Need branchId - for now, navigate to branches
    this.router.navigate(['/branches']);
  }

  getTotalResults(): number {
    return this.results.subjects.length + 
           this.results.materials.length + 
           this.results.branches.length + 
           this.results.regulations.length;
  }
}

