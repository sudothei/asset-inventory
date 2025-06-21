import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";

import jwt_decode from "jwt-decode";
import Claims from "types/Claims";

interface AssetDrawerProps {
  open: boolean;
  handleClick: () => void;
}

const AssetDrawer = (props: AssetDrawerProps) => {
  const { open, handleClick } = props;
  const [isAdmin, setIsAdmin] = useState(false);

  // For logout button
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // for admin-only UI elements
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decodedToken: Claims = jwt_decode(token);
      if (decodedToken) {
        if (Date.now() / 1000 < decodedToken.exp) {
          setIsAdmin(decodedToken.admin);
        }
      }
    }
  }, []);

  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
      variant="temporary"
      anchor="left"
      open={open}
      onClose={handleClick}
    >
      <List>
        {isAdmin ? (
          <ListItem key={"Users"} disablePadding>
            <ListItemButton href="/users">
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary={"Users"} />
            </ListItemButton>
          </ListItem>
        ) : (
          ""
        )}
      </List>
      <Divider />
      <List>
        <ListItem key={"Logout"} disablePadding>
          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={"Logout"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};
export default AssetDrawer;
