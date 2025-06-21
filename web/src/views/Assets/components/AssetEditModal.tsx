import * as React from "react";
import { useState, useEffect } from "react";
import { useAppDispatch } from "hooks";
import { useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

import EnhancedInputField from "components/EnhancedInputField";
import Asset from "types/Asset";
import editAsset from "thunks/editAsset";
import jwt_decode from "jwt-decode";
import Claims from "types/Claims";

interface AssetEditModalProps {
  open: boolean;
  handleClose: () => void;
  asset: Asset | undefined;
}

const AssetEditModal = (props: AssetEditModalProps) => {
  const { open, handleClose, asset } = props;

  // for write access UI features
  const [writeAccess, setWriteAccess] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken: Claims = jwt_decode(token);
      if (decodedToken) {
        if (Date.now() / 1000 < decodedToken.exp) {
          setWriteAccess(decodedToken.write);
        }
      }
    }
  }, []);

  const dispatch = useAppDispatch();
  let defaultValues = {};
  const methods = useForm<Asset>({ defaultValues: defaultValues });
  const { handleSubmit, reset, control } = methods;
  const onSubmit = (data: Asset) => {
    dispatch(editAsset(data));
    handleClose();
  };

  useEffect(() => {
    defaultValues = { oid: asset ? asset._id.$oid : "", ...asset };
    reset(defaultValues);
  }, [asset]);

  const handleBackdropClick = () => {
    defaultValues = { oid: asset ? asset._id.$oid : "", ...asset };
    reset(defaultValues);
    handleClose();
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      onBackdropClick={handleBackdropClick}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            "& .MuiTextField-root": { maxWidth: "50ch" },
          }}
        >
          <EnhancedInputField
            name="oid"
            label="Object Id"
            required={true}
            readonly={true}
            rules={{
              required: { value: true, message: "Required" },
              minLength: 1,
              maxLength: { value: 255, message: "Maximum 255" },
            }}
            control={control}
          />
          <EnhancedInputField
            name="name"
            label="Name"
            required={true}
            readonly={!writeAccess}
            rules={{
              required: { value: true, message: "Required" },
              minLength: 1,
              maxLength: { value: 255, message: "Maximum 255" },
            }}
            control={control}
          />
          <EnhancedInputField
            name="assetno"
            label="Asset No"
            required={true}
            readonly={!writeAccess}
            rules={{
              required: { value: true, message: "Required" },
              minLength: 1,
              maxLength: { value: 255, message: "Maximum 255" },
            }}
            control={control}
          />
          <EnhancedInputField
            name="vendor"
            label="Vendor"
            required={true}
            readonly={!writeAccess}
            rules={{
              required: { value: true, message: "Required" },
              minLength: 1,
              maxLength: { value: 255, message: "Maximum 255" },
            }}
            control={control}
          />
          <EnhancedInputField
            name="category"
            label="Category"
            required={true}
            readonly={!writeAccess}
            rules={{
              required: { value: true, message: "Required" },
              minLength: 1,
              maxLength: { value: 255, message: "Maximum 255" },
            }}
            control={control}
          />
          <EnhancedInputField
            name="subcategory"
            label="Subcategory"
            readonly={!writeAccess}
            rules={{ maxLength: { value: 255, message: "Maximum 255" } }}
            control={control}
          />
          <EnhancedInputField
            name="count"
            label="Count"
            type="number"
            required={true}
            readonly={!writeAccess}
            rules={{ required: { value: true, message: "Required" }, min: 1 }}
            control={control}
          />
          <EnhancedInputField
            name="location"
            label="Location"
            required={true}
            readonly={!writeAccess}
            rules={{
              required: { value: true, message: "Required" },
              minLength: 1,
              maxLength: { value: 255, message: "Maximum 255" },
            }}
            control={control}
          />
          <EnhancedInputField
            name="sublocation"
            label="Sublocation"
            readonly={!writeAccess}
            rules={{ maxLength: { value: 255, message: "Maximum 255" } }}
            control={control}
          />
          <EnhancedInputField
            name="serialno"
            label="Serial No"
            readonly={!writeAccess}
            rules={{ maxLength: { value: 255, message: "Maximum 255" } }}
            control={control}
          />
          <EnhancedInputField
            name="notes"
            readonly={!writeAccess}
            label="Notes"
            control={control}
          />
          <EnhancedInputField
            name="description"
            label="Description"
            multiline={true}
            readonly={!writeAccess}
            rules={{ maxLength: { value: 255, message: "Maximum 255" } }}
            control={control}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              paddingTop: 4,
            }}
          >
            {writeAccess ? (
              <Button type="submit" variant="contained" color="secondary">
                Update
              </Button>
            ) : (
              ""
            )}
          </Box>
        </Box>
      </form>
    </Modal>
  );
};
export default AssetEditModal;
