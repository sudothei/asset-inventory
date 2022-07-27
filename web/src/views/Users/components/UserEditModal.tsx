import * as React from "react";
import { useEffect } from "react";
import { useAppDispatch } from "hooks";
import { useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

import EnhancedInputField from "components/EnhancedInputField";
import EnhancedSwitch from "components/EnhancedSwitch";
import User from "types/User";
import editUser from "thunks/editUser";
import sendPassReset from "thunks/sendPassReset";

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
  const handlePassReset = () => {
    if (user) {
      dispatch(sendPassReset(user.email));
    }
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
            readonly={true}
            control={control}
          />
          <EnhancedInputField
            name="firstname"
            label="First Name"
            readonly={true}
            control={control}
          />
          <EnhancedInputField
            name="lastname"
            label="Last Name"
            readonly={true}
            control={control}
          />
          <EnhancedInputField
            name="email"
            label="Email"
            readonly={true}
            control={control}
          />
          <EnhancedInputField
            name="status"
            label="Status"
            readonly={true}
            control={control}
          />
          <EnhancedSwitch name="admin" label="Admin" control={control} />
          <EnhancedSwitch name="write" label="Write Access" control={control} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              paddingTop: 4,
              justifyContent: "space-between",
            }}
          >
            <Button type="submit" variant="contained" color="secondary">
              Update
            </Button>
            <Button onClick={handlePassReset} variant="contained">
              Send Password Reset
            </Button>
          </Box>
        </Box>
      </form>
    </Modal>
  );
};
export default UserEditModal;
