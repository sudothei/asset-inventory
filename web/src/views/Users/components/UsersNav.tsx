import * as React from "react";
import { useState } from "react";
import { useAppSelector } from "hooks";
import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";

import MenuIcon from "@mui/icons-material/Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Icon from "@mui/material/Icon";

import { CSVLink } from "react-csv";

import UsersDrawer from "./UsersDrawer";
import UserAddModal from "./UserAddModal";
import UserDeleteMenu from "./UserDeleteMenu";

import Asset from "types/Asset";
import { RootState } from "store";

interface DashNavProps {
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
}

const DashNav = (props: DashNavProps) => {
  const { onSearch, onDelete } = props;
  const navigate = useNavigate();

  // For the download as CSV button
  const assets: Asset[] = useAppSelector((state: RootState) => state.assets);
  const csvHeaders =
    assets.length > 0
      ? Object.keys(assets[0]).map((x) => ({ label: x, key: x }))
      : [];

  // For the left drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setDrawerOpen((drawerOpen) => !drawerOpen);
  };

  // For the new asset modal
  const [assetAddModalOpen, setAssetAddModalOpen] = useState(false);
  const toggleAssetAddModal = () => {
    setAssetAddModalOpen((assetAddModalOpen) => !assetAddModalOpen);
  };

  // For the delete menu
  const [deleteAnchorEl, setDeleteAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const open = Boolean(deleteAnchorEl);
  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteAnchorEl(event.currentTarget);
  };
  const handleDeleteClose = () => {
    setDeleteAnchorEl(null);
  };

  // For the logout button
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar position="fixed">
      <UsersDrawer open={drawerOpen} handleClick={toggleDrawer} />
      <UserAddModal
        open={assetAddModalOpen}
        handleClose={toggleAssetAddModal}
      />
      <UserDeleteMenu
        anchorEl={deleteAnchorEl}
        open={open}
        onClose={handleDeleteClose}
        onDelete={onDelete}
      />
      <Toolbar sx={{ flex: "1" }}>
        <Box
          sx={{
            display: "flex",
            flexFlow: "row",
            flex: "1",
            justifyContent: "flex-start",
          }}
        >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ alignSelf: "center" }}>
            Users
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flex: "1",
            alignItems: "center",
          }}
        >
          {/* Included for visual symmetry */}
          <IconButton onClick={handleDeleteClick}>
            <DeleteIcon fontSize="large" color="primary" />
          </IconButton>
          <IconButton>
            <CSVLink
              headers={csvHeaders}
              data={assets}
              filename="assets.csv"
              target="_blank"
            >
              <FileDownloadIcon fontSize="large" color="primary" />
            </CSVLink>
          </IconButton>
          <Input
            color="secondary"
            sx={{ input: { textAlign: "center" } }}
            placeholder="Search"
            onChange={onSearch}
          />
          <IconButton onClick={toggleAssetAddModal}>
            <AddBoxIcon fontSize="large" color="secondary" />
          </IconButton>
          <IconButton disabled={true}>
            <Icon fontSize="large" />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", flex: "1" }}>
          <Button onClick={logout} color="inherit">
            Log Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default DashNav;
