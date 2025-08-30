export class CloudHistory {
    async getHistoryStats(orgId: string, userId: string) {
    return {
      total: 0,
      recent: 0,
      retention_summary: { 
        total: 0, 
        recent: 0,
        expiring_soon: 0
      }
    };
  }
  
  async getHistory(filters: HistoryFilters, orgId?: string) {
    return [];
  }
  
  async saveToHistory(data: any) {
    return { id: 'stub-id' };
  }
  
  async toggleFavorite(historyId: string, userId: string) {
    return { isFavorite: false };
  }
  
  async deleteHistoryEntry(historyId: string, userId: string) {
    return { success: true };
  }
}

export interface HistoryFilters {
  limit?: number;
  offset?: number;
  search?: string;
  domain?: string;
  module_id?: string;
  preset_id?: string;
  date_from?: string;
  date_to?: string;
  min_score?: number;
  only_favorites?: boolean;
  shared_only?: boolean;
  user_id?: string;
  userId?: string; // Alternative naming
  tags?: string[];
  orgId?: string;
  filters?: any; // Additional filters object
  page?: number; // Page number for pagination
  includeFullContent?: boolean; // Include full content in results
}

export const cloudHistory = new CloudHistory();
