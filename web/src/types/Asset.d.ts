import AssetRequest from "types/AssetRequest";
interface Asset extends AssetRequest {
  _id: {
    $oid: string;
  };
  name: string;
  assetno: string;
  vendor: string;
  category: string;
  count: number;
  location: string;
  subcategory?: string | null;
  sublocation?: string | null;
  description?: string | null;
  serialno?: string | null;
  notes?: string | null;
}
export default Asset;
