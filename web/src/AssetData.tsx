export interface AssetData {
  id: number;
  name: string;
  partno: string;
  vendor: string;
  category: string;
  subcategory?: string;
  count: number;
  location: string;
  sublocation?: string;
  description?: string;
  serialno?: string;
  notes?: string;
}

export interface AssetDataRequired {
  id: number;
  name: string;
  partno: string;
  vendor: string;
  category: string;
  count: number;
  location: string;
}
