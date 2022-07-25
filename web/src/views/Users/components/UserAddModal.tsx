import * as React from "react";
import { useAppDispatch } from "hooks";
import { useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

import EnhancedInputField from "components/EnhancedInputField";
import EnhancedSwitch from "components/EnhancedSwitch";
import UserRequest from "types/UserRequest";
import addUser from "thunks/addUser";

interface UserAddModalProps {
  open: boolean;
  handleClose: () => void;
}

const UserAddModal = (props: UserAddModalProps) => {
  const { open, handleClose } = props;

  const defaultValues = {
    firstname: "",
    lastname: "",
    email: "",
    admin: false,
    write: false,
  };

  const dispatch = useAppDispatch();

  const methods = useForm<UserRequest>({ defaultValues: defaultValues });
  const { handleSubmit, reset, control } = methods;
  const onSubmit = (data: UserRequest) => {
    dispatch(addUser(data));
    reset();
    handleClose();
  };

  const handleBackdropClick = () => {
    handleClose();
    reset();
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
            name="firstname"
            label="First Name"
            required={true}
            rules={{
              required: { value: true, message: "Required" },
              minLength: 1,
              maxLength: { value: 30, message: "Maximum 30" },
            }}
            control={control}
          />
          <EnhancedInputField
            name="lastname"
            label="Last Name"
            required={true}
            rules={{
              required: { value: true, message: "Required" },
              minLength: 1,
              maxLength: { value: 30, message: "Maximum 30" },
            }}
            control={control}
          />
          <EnhancedInputField
            name="email"
            label="Email"
            required={true}
            rules={{
              required: { value: true, message: "Required" },
              minLength: 1,
              maxLength: { value: 70, message: "Maximum 70" },
              pattern: {
                value: /.*@.*\..*/,
                message: "Must be a valid email",
              },
            }}
            control={control}
          />
          <EnhancedSwitch name="admin" label="Admin" control={control} />
          <EnhancedSwitch name="write" label="Write Access" control={control} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              paddingTop: 4,
            }}
          >
            <Button type="submit" variant="contained" color="secondary">
              Add New
            </Button>
          </Box>
        </Box>
      </form>
    </Modal>
  );
};
export default UserAddModal;
