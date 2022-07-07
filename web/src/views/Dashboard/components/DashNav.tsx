import * as React from "react";
import { useState } from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";

import MenuIcon from "@mui/icons-material/Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Icon from "@mui/material/Icon";

import { DashDrawer } from "./DashDrawer";
import { AssetAddModal } from "./AssetAddModal";

export const DashNav = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setDrawerOpen((drawerOpen) => !drawerOpen);
  };

  // For the new asset modal
  const [assetAddModalOpen, setAssetAddModalOpen] = useState(false);
  const toggleAssetAddModal = () => {
    setAssetAddModalOpen((assetAddModalOpen) => !assetAddModalOpen);
  };

  return (
    <AppBar position="fixed">
      <DashDrawer open={drawerOpen} handleClick={toggleDrawer} />
      <AssetAddModal
        open={assetAddModalOpen}
        handleClose={toggleAssetAddModal}
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
            Inventory Asset DB
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
          <IconButton disabled={true}>
            <Icon fontSize="large" />
          </IconButton>
          <IconButton>
            <FileDownloadIcon fontSize="large" color="primary" />
          </IconButton>
          <Input
            color="secondary"
            sx={{ input: { textAlign: "center" } }}
            placeholder="Search"
          />
          <IconButton onClick={toggleAssetAddModal}>
            <AddBoxIcon fontSize="large" color="secondary" />
          </IconButton>
          <IconButton>
            <DeleteIcon fontSize="large" color="primary" />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", flex: "1" }}>
          <Button color="inherit" href="/login">
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};