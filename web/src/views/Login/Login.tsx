import * as React from "react";
import { useEffect, useState } from "react";
import { useAppDispatch } from "hooks";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import requestPassForm from "thunks/requestPassForm";
import login from "helpers/login";
import LoginForm from "types/LoginForm";
import EnhancedInputField from "components/EnhancedInputField";

const Login = () => {
  const [waiting, setWaiting] = useState(false);

  let defaultValues: LoginForm = {
    email: "",
    password: "",
  };
  const { oid, token } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (oid && token) {
      dispatch(requestPassForm({ oid, token }));
    }
  }, []);

  const methods = useForm<LoginForm>({ defaultValues: defaultValues });
  const { handleSubmit, reset, control } = methods;

  const onSubmit = (data: LoginForm) => {
    login(data);
    setWaiting(true);
  };

  useEffect(() => {
    if (oid && token) {
      defaultValues = {
        email: "",
        password: "",
      };
    }
    reset(defaultValues);
  }, []);

  return (
    <Box sx={{ paddingTop: 10, paddingRight: 10, paddingLeft: 10 }}>
      {waiting ? (
        <CircularProgress
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
          color="secondary"
        />
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                Login
              </Typography>
              <EnhancedInputField
                name="email"
                label="Email"
                control={control}
              />
              <EnhancedInputField
                name="password"
                label="Password"
                type="password"
                control={control}
                rules={{
                  required: { value: true, message: "Required" },
                  minLength: 1,
                  maxLength: { value: 255, message: "Maximum 255" },
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
                  Login
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      )}
    </Box>
  );
};

export default Login;
