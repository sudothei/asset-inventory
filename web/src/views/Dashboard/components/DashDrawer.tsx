import * as React from "react";
import { useState } from "react";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";
import CategoryIcon from "@mui/icons-material/Category";
import LogoutIcon from "@mui/icons-material/Logout";

import UserAddModal from "./UserAddModal";

interface DashDrawerProps {
  open: boolean;
  handleClick: () => void;
}

const DashDrawer = (props: DashDrawerProps) => {
  const { open, handleClick } = props;

  // For the user add modal
  const [userAddModalOpen, setUserAddModalOpen] = useState(false);
  const toggleUserAddModal = () => {
    setUserAddModalOpen((userAddModalOpen) => !userAddModalOpen);
  };

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
      <UserAddModal open={userAddModalOpen} handleClose={toggleUserAddModal} />
      <Divider />
      <List>
        <ListItem key={"Add User"} disablePadding>
          <ListItemButton onClick={toggleUserAddModal}>
            <ListItemIcon>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary={"Add User"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Manage Users"} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary={"Manage Users"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Categories"} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary={"Categories"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem key={"Logout"} disablePadding>
          <ListItemButton>
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
export default DashDrawer;
