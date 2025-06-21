import * as React from "react";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "hooks";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import requestPassForm from "thunks/requestPassForm";
import setPassword from "thunks/setPassword";
import User from "types/User";
import UserPasswordForm from "types/UserPasswordForm";
import { RootState } from "store";
import EnhancedInputField from "components/EnhancedInputField";
import EnhancedSwitch from "components/EnhancedSwitch";

const SetPassword = () => {
  const navigate = useNavigate();

  let defaultValues: UserPasswordForm = {
    oid: "",
    token: "",
    firstname: "",
    lastname: "",
    admin: false,
    write: false,
    email: "",
    status: "Pending",
    password: "",
    confirm: "",
  };
  const { oid, token } = useParams();
  const dispatch = useAppDispatch();

  const user: User = useAppSelector((state: RootState) => state.register);

  useEffect(() => {
    if (oid && token) {
      dispatch(requestPassForm({ oid, token }));
    }
  }, []);

  const methods = useForm<UserPasswordForm>({ defaultValues: defaultValues });
  const { reset, control, watch } = methods;

  const password = watch("password", "");
  const confirm = watch("confirm", "");

  const onSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (oid && token && password) {
      dispatch(setPassword({ oid, token, password }));
    }
    navigate("/");
  };

  useEffect(() => {
    if (oid && token) {
      defaultValues = {
        oid: oid,
        token: token,
        firstname: user.firstname,
        lastname: user.lastname,
        admin: user.admin,
        write: user.write,
        email: user.email,
        status: "Pending",
        password: "",
        confirm: "",
      };
    }
    reset(defaultValues);
  }, [user]);

  return (
    <Box sx={{ paddingTop: 10, paddingRight: 10, paddingLeft: 10 }}>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <form onSubmit={onSubmit}>
          <Box
            sx={{
              p: 4,
              "& .MuiTextField-root": { maxWidth: "50ch" },
            }}
          >
            <Typography
              variant="h2"
              component="h2"
              sx={{ textAlign: "center" }}
            >
              Welcome to the Asset DB
            </Typography>
            <Typography
              variant="h4"
              component="h4"
              sx={{ textAlign: "center" }}
            >
              Set your password here.
            </Typography>
            <EnhancedInputField
              hidden
              name="oid"
              label="Object Id"
              readonly={true}
              control={control}
            />
            <EnhancedInputField
              hidden
              name="token"
              label="Token"
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
            <EnhancedSwitch
              name="admin"
              readonly={true}
              label="Admin"
              control={control}
            />
            <EnhancedSwitch
              name="write"
              readonly={true}
              label="Write Access"
              control={control}
            />
            <EnhancedInputField
              name="password"
              label="Password"
              type="password"
              required={true}
              control={control}
              rules={{
                required: { value: true, message: "Required" },
                minLength: 1,
                maxLength: { value: 255, message: "Maximum 255" },
                validate: {
                  value: (x: string) => {
                    return x === confirm || "Passwords must match";
                  },
                  message: "Passwords must match",
                },
              }}
            />
            <EnhancedInputField
              name="confirm"
              label="Confirm"
              required={true}
              type="password"
              control={control}
              rules={{
                required: { value: true, message: "Required" },
                minLength: 1,
                maxLength: { value: 255, message: "Maximum 255" },
                validate: {
                  value: (x: string) => {
                    return x === password || "Passwords must match";
                  },
                  message: "Passwords must match",
                },
              }}
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
      </Paper>
    </Box>
  );
};

export default SetPassword;
