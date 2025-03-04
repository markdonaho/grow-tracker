// src/lib/api-mutations.ts

/**
 * Generic API call with error handling
 */
async function apiCall<T = any>(
    url: string, 
    method: string, 
    body?: any
  ): Promise<T> {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
  
    if (body) {
      options.body = JSON.stringify(body);
    }
  
    const response = await fetch(url, options);
  
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `API call failed with status ${response.status}`);
    }
  
    return response.json();
  }
  
  /**
   * Upload a file with multipart form data
   */
  export async function uploadFile(
    file: File,
    entityType: 'Plant' | 'Action',
    entityId: string
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', entityType);
    formData.append('entityId', entityId);
  
    const response = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `File upload failed with status ${response.status}`);
    }
  
    return response.json();
  }
  
  // Plant API mutations
  export const plantsApi = {
    /**
     * Create a new plant
     */
    create: (data: any) => apiCall('/api/plants', 'POST', data),
  
    /**
     * Update a plant
     */
    update: (id: string, data: any) => apiCall(`/api/plants/${id}`, 'PATCH', data),
  
    /**
     * Delete a plant
     */
    delete: (id: string) => apiCall(`/api/plants/${id}`, 'DELETE'),
  
    /**
     * Add a growth metric to a plant
     */
    addGrowthMetric: (id: string, data: any) => 
      apiCall(`/api/plants/${id}/growth`, 'POST', data),
  
    /**
     * Mark a plant as harvested
     */
    harvest: (id: string, harvestDate?: Date) => 
      apiCall(`/api/plants/${id}/harvest`, 'POST', { harvestDate }),
  };
  
  // Action API mutations
  export const actionsApi = {
    /**
     * Create a new action
     */
    create: (data: any) => apiCall('/api/actions', 'POST', data),
  
    /**
     * Update an action
     */
    update: (id: string, data: any) => apiCall(`/api/actions/${id}`, 'PATCH', data),
  
    /**
     * Delete an action
     */
    delete: (id: string) => apiCall(`/api/actions/${id}`, 'DELETE'),
  };
  
  // Image API mutations
  export const imagesApi = {
    /**
     * Upload an image
     */
    upload: uploadFile,
  
    /**
     * Delete an image
     */
    delete: (id: string) => apiCall(`/api/images/${id}`, 'DELETE'),
  };