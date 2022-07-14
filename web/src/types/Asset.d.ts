interface Asset {
  id: number;
  name: string;
  assetno: string;
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
export default Asset;