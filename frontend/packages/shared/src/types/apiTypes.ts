// ========== API RESPONSE ==========
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ========== PAGINATION ==========
export interface PageRequest {
  page?: number;
  size?: number;
  sort?: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
