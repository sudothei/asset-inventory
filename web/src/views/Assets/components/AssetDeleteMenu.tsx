import * as React from "react";

import Paper from "@mui/material/Paper";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";

interface AssetDeleteMenuProps {
  onClose: () => void;
  onDelete: () => void;
  open: boolean;
  anchorEl: null | HTMLElement;
}

const AssetDeleteMenu = (props: AssetDeleteMenuProps) => {
  const { open, onClose, anchorEl, onDelete } = props;

  return (
    <Paper sx={{ width: 320, maxWidth: "100%" }}>
      <Menu open={open} onClose={onClose} anchorEl={anchorEl}>
        <MenuItem>
          <ListItemText onClick={onDelete}>
            Delete selected forever.
          </ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default AssetDeleteMenu;
