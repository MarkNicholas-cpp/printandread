import { Injectable } from '@angular/core';

export interface AccessRecord {
    id: number;
    name: string;
    type: 'material' | 'branch' | 'regulation' | 'subject';
    lastAccessed: string;
    accessCount: number;
    // Additional metadata for navigation
    metadata?: {
        branchId?: number;
        regulationId?: number;
        yearId?: number;
        semesterId?: number;
        subjectId?: number;
        materialId?: number;
        code?: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class AccessTrackingService {
    private readonly STORAGE_KEY = 'frequentlyAccessed';
    private readonly MAX_ITEMS = 10; // Max items per type
    private readonly MAX_TOTAL_ITEMS = 30; // Max total items to store

    /**
     * Track access to an item
     */
    trackAccess(
        id: number,
        name: string,
        type: 'material' | 'branch' | 'regulation' | 'subject',
        metadata?: AccessRecord['metadata']
    ): void {
        const records = this.getAllRecords();

        // Find existing record
        const existingIndex = records.findIndex(
            r => r.id === id && r.type === type
        );

        if (existingIndex >= 0) {
            // Update existing record
            records[existingIndex].accessCount++;
            records[existingIndex].lastAccessed = new Date().toISOString();
            records[existingIndex].name = name; // Update name in case it changed
            if (metadata) {
                records[existingIndex].metadata = { ...records[existingIndex].metadata, ...metadata };
            }
        } else {
            // Add new record
            records.push({
                id,
                name,
                type,
                lastAccessed: new Date().toISOString(),
                accessCount: 1,
                metadata
            });
        }

        // Sort by access count (descending) and last accessed (descending)
        records.sort((a, b) => {
            if (b.accessCount !== a.accessCount) {
                return b.accessCount - a.accessCount;
            }
            return new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime();
        });

        // Keep only top items per type and limit total
        const grouped = this.groupByType(records);
        const topRecords: AccessRecord[] = [];

        for (const type of ['material', 'branch', 'regulation', 'subject'] as const) {
            const typeRecords = grouped[type] || [];
            topRecords.push(...typeRecords.slice(0, this.MAX_ITEMS));
        }

        // Limit total items
        const finalRecords = topRecords.slice(0, this.MAX_TOTAL_ITEMS);

        // Save to localStorage
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(finalRecords));
        } catch (e) {
            console.warn('Failed to save access tracking data:', e);
        }
    }

    /**
     * Get frequently accessed items by type
     */
    getFrequentlyAccessed(type?: 'material' | 'branch' | 'regulation' | 'subject', limit: number = 6): AccessRecord[] {
        const records = this.getAllRecords();

        if (type) {
            return records
                .filter(r => r.type === type)
                .slice(0, limit);
        }

        return records.slice(0, limit);
    }

    /**
     * Get all records grouped by type
     */
    getGroupedRecords(): {
        materials: AccessRecord[];
        branches: AccessRecord[];
        regulations: AccessRecord[];
        subjects: AccessRecord[];
    } {
        const records = this.getAllRecords();
        return {
            materials: records.filter(r => r.type === 'material').slice(0, 6),
            branches: records.filter(r => r.type === 'branch').slice(0, 6),
            regulations: records.filter(r => r.type === 'regulation').slice(0, 6),
            subjects: records.filter(r => r.type === 'subject').slice(0, 6)
        };
    }

    /**
     * Clear all tracking data
     */
    clearAll(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    /**
     * Clear tracking data for a specific type
     */
    clearType(type: 'material' | 'branch' | 'regulation' | 'subject'): void {
        const records = this.getAllRecords();
        const filtered = records.filter(r => r.type !== type);
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
        } catch (e) {
            console.warn('Failed to clear access tracking data:', e);
        }
    }

    private getAllRecords(): AccessRecord[] {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.warn('Failed to read access tracking data:', e);
            return [];
        }
    }

    private groupByType(records: AccessRecord[]): Record<string, AccessRecord[]> {
        return records.reduce((acc, record) => {
            if (!acc[record.type]) {
                acc[record.type] = [];
            }
            acc[record.type].push(record);
            return acc;
        }, {} as Record<string, AccessRecord[]>);
    }
}

