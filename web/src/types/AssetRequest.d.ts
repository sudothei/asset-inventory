import AssetRequired from "types/AssetRequired";
interface AssetRequest extends AssetRequired {
  subcategory?: string;
  sublocation?: string;
  description?: string;
  serialno?: string;
  notes?: string;
}
export default AssetRequest;
