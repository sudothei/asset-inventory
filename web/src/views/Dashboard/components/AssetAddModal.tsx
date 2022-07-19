import * as React from "react";
import { useAppDispatch } from "hooks";
import { useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

import EnhancedInputField from "./EnhancedInputField";
import AssetRequest from "types/AssetRequest";
import addAsset from "thunks/addAsset";

interface AssetAddModalProps {
  open: boolean;
  handleClose: () => void;
}

const AssetAddModal = (props: AssetAddModalProps) => {
  const { open, handleClose } = props;

  const defaultValues = {
    name: "",
    assetno: "",
    vendor: "",
    category: "",
    subcategory: null,
    count: 1,
    location: "",
    sublocation: null,
    description: null,
    serialno: null,
    notes: null,
  };

  const dispatch = useAppDispatch();

  const methods = useForm<AssetRequest>({ defaultValues: defaultValues });
  const { handleSubmit, reset, control } = methods;
  const onSubmit = (data: AssetRequest) => {
    console.log(data);
    //dispatch(addAsset(data));
    //reset();
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      onBackdropClick={handleClose}
    >
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
          name="name"
          label="Name"
          required={true}
          control={control}
        />
        <EnhancedInputField
          name="assetno"
          label="Asset No"
          required={true}
          control={control}
        />
        <EnhancedInputField
          name="vendor"
          label="Vendor"
          required={true}
          control={control}
        />
        <EnhancedInputField
          name="category"
          label="Category"
          required={true}
          control={control}
        />
        <EnhancedInputField
          name="subcategory"
          label="Subcategory"
          control={control}
        />
        <EnhancedInputField
          name="count"
          label="Count"
          type="number"
          required={true}
          control={control}
        />
        <EnhancedInputField
          name="location"
          label="Location"
          required={true}
          control={control}
        />
        <EnhancedInputField
          name="sublocation"
          label="Sublocation"
          control={control}
        />
        <EnhancedInputField
          name="serialno"
          label="Serial No"
          control={control}
        />
        <EnhancedInputField name="notes" label="Notes" control={control} />
        <EnhancedInputField
          name="description"
          label="Description"
          multiline={true}
          control={control}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
            paddingTop: 4,
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit(onSubmit)}
          >
            Add New
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
export default AssetAddModal;
