import * as React from "react";
import { useEffect } from "react";
import { useAppDispatch } from "hooks";
import { useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

import EnhancedInputField from "./EnhancedInputField";
import User from "types/User";
import editUser from "thunks/editUser";

interface UserEditModalProps {
  open: boolean;
  handleClose: () => void;
  user: User | undefined;
}

const UserEditModal = (props: UserEditModalProps) => {
  const { open, handleClose, user } = props;

  const dispatch = useAppDispatch();
  let defaultValues = {};
  const methods = useForm<User>({ defaultValues: defaultValues });
  const { handleSubmit, reset, control } = methods;
  const onSubmit = (data: User) => {
    dispatch(editUser(data));
    handleClose();
  };

  useEffect(() => {
    defaultValues = { oid: user ? user._id.$oid : "", ...user };
    reset(defaultValues);
  }, [user]);

  const handleBackdropClick = () => {
    defaultValues = { oid: user ? user._id.$oid : "", ...user };
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
            rules={{
              required: { value: true, message: "Required" },
              minLength: 1,
              maxLength: { value: 255, message: "Maximum 255" },
            }}
            control={control}
          />
          <EnhancedInputField
            name="userno"
            label="User No"
            required={true}
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
            rules={{ maxLength: { value: 255, message: "Maximum 255" } }}
            control={control}
          />
          <EnhancedInputField
            name="count"
            label="Count"
            type="number"
            required={true}
            rules={{ required: { value: true, message: "Required" }, min: 1 }}
            control={control}
          />
          <EnhancedInputField
            name="location"
            label="Location"
            required={true}
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
            rules={{ maxLength: { value: 255, message: "Maximum 255" } }}
            control={control}
          />
          <EnhancedInputField
            name="serialno"
            label="Serial No"
            rules={{ maxLength: { value: 255, message: "Maximum 255" } }}
            control={control}
          />
          <EnhancedInputField name="notes" label="Notes" control={control} />
          <EnhancedInputField
            name="description"
            label="Description"
            multiline={true}
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
            <Button type="submit" variant="contained" color="secondary">
              Update
            </Button>
          </Box>
        </Box>
      </form>
    </Modal>
  );
};
export default UserEditModal;
