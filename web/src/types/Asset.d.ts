import AssetRequest from "types/AssetRequest";
interface Asset extends AssetRequest {
  _id: {
    $oid: string;
  };
}
export default Asset;
