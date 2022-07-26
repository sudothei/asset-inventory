import * as React from "react";
//import { useEffect } from "react";
//import { useAppSelector, useAppDispatch } from "hooks";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

//import getUsers from "thunks/getUsers";

//import User from "types/User";
//import { RootState } from "store";

const SetPassword = () => {
  //const dispatch = useAppDispatch();

  //useEffect(() => {
  //dispatch(getUsers());
  //}, [dispatch]);

  //const users: User[] = useAppSelector((state: RootState) => state.users);

  return (
    <Box sx={{ paddingTop: 10, paddingRight: 10, paddingLeft: 10 }}>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>FORM GO HERE :D</Paper>
    </Box>
  );
};

export default SetPassword;
