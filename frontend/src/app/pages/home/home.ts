import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService, Material } from '../../services/api';
import { AccessTrackingService, AccessRecord } from '../../services/access-tracking.service';
import { TitleCasePipe } from '@angular/common';
import { GridSkeletonComponent } from '../../components/skeleton/grid-skeleton/grid-skeleton';
import { SearchBarComponent } from '../../components/search-bar/search-bar';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TitleCasePipe, GridSkeletonComponent, SearchBarComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  recentMaterials: Material[] = [];
  continueLearning: Material | null = null;
  loading = true;
  
  // Frequently accessed items
  frequentlyAccessedMaterials: Material[] = [];
  frequentlyAccessedBranches: AccessRecord[] = [];
  frequentlyAccessedRegulations: AccessRecord[] = [];
  frequentlyAccessedSubjects: AccessRecord[] = [];
  loadingFrequentlyAccessed = true;

  constructor(
    private api: ApiService,
    private router: Router,
    private accessTracking: AccessTrackingService
  ) { }

  ngOnInit(): void {
    // Load recent materials
    this.api.getRecentMaterials(10).subscribe({
      next: (materials) => {
        this.recentMaterials = materials;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching recent materials:', err);
        this.loading = false;
      }
    });

    // Load continue learning (from localStorage)
    this.loadContinueLearning();
    
    // Load frequently accessed items
    this.loadFrequentlyAccessed();
  }
  
  loadFrequentlyAccessed(): void {
    const grouped = this.accessTracking.getGroupedRecords();
    
    // Load frequently accessed materials
    const materialRecords = grouped.materials;
    if (materialRecords.length > 0) {
      const materialIds = materialRecords.map(r => r.id);
      // Fetch material details for each ID
      const materialPromises = materialIds.map(id => 
        firstValueFrom(this.api.getMaterialById(id))
      );
      
      Promise.all(materialPromises).then(materials => {
        this.frequentlyAccessedMaterials = materials.filter(m => m !== null && m !== undefined) as Material[];
        this.loadingFrequentlyAccessed = false;
      }).catch(err => {
        console.error('Error loading frequently accessed materials:', err);
        this.loadingFrequentlyAccessed = false;
      });
    } else {
      this.loadingFrequentlyAccessed = false;
    }
    
    // Set frequently accessed branches, regulations, and subjects
    this.frequentlyAccessedBranches = grouped.branches;
    this.frequentlyAccessedRegulations = grouped.regulations;
    this.frequentlyAccessedSubjects = grouped.subjects;
  }

  loadContinueLearning(): void {
    // Get last viewed material from localStorage
    const lastViewed = localStorage.getItem('lastViewedMaterial');
    if (lastViewed) {
      try {
        const materialData = JSON.parse(lastViewed);
        // Verify material still exists by fetching it
        this.api.getMaterialById(materialData.id).subscribe({
          next: (material) => {
            this.continueLearning = material;
          },
          error: () => {
            // Material might have been deleted, clear from storage
            localStorage.removeItem('lastViewedMaterial');
          }
        });
      } catch (e) {
        localStorage.removeItem('lastViewedMaterial');
      }
    }
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  navigateToMaterial(material: Material): void {
    // Save to localStorage for "Continue Learning"
    localStorage.setItem('lastViewedMaterial', JSON.stringify({
      id: material.id,
      title: material.title,
      subjectId: material.subjectId,
      timestamp: new Date().toISOString()
    }));
    this.router.navigate(['/viewer', material.id]);
  }

  navigateToBranches(): void {
    this.router.navigate(['/branches']);
  }
  
  navigateToFrequentlyAccessedBranch(record: AccessRecord): void {
    if (record.metadata?.branchId) {
      this.router.navigate(['/regulations', record.metadata.branchId]);
    } else {
      this.router.navigate(['/branches']);
    }
  }
  
  navigateToFrequentlyAccessedRegulation(record: AccessRecord): void {
    if (record.metadata?.branchId && record.metadata?.regulationId) {
      this.router.navigate(['/years', record.metadata.branchId, record.metadata.regulationId]);
    } else {
      this.router.navigate(['/branches']);
    }
  }
  
  navigateToFrequentlyAccessedSubject(record: AccessRecord): void {
    if (record.metadata?.subjectId) {
      this.router.navigate(['/materials', record.metadata.subjectId]);
    } else {
      this.router.navigate(['/branches']);
    }
  }

  onSearch(query: string): void {
    if (query.trim()) {
      this.router.navigate(['/search'], { 
        queryParams: { q: query.trim() } 
      });
    }
  }
}
