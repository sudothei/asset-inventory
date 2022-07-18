import * as React from "react";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

interface AssetAddModalProps {
  open: boolean;
  handleClose: () => void;
}

const AssetAddModal = (props: AssetAddModalProps) => {
  const { open, handleClose } = props;

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      onBackdropClick={handleClose}
    >
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
        <Box className="form-field">
          <Typography>*Name:</Typography>
          <TextField
            required
            fullWidth
            id="filled-required"
            hiddenLabel
            margin="dense"
            variant="filled"
            size="small"
          />
        </Box>
        <Box className="form-field">
          <Typography>*Vendor:</Typography>
          <TextField
            required
            fullWidth
            id="filled-required"
            hiddenLabel
            margin="dense"
            variant="filled"
            size="small"
          />
        </Box>
        <Box className="form-field">
          <Typography>*Asset No:</Typography>
          <TextField
            required
            fullWidth
            id="filled-required"
            hiddenLabel
            margin="dense"
            variant="filled"
            size="small"
          />
        </Box>
        <Box className="form-field">
          <Typography>*Category:</Typography>
          <TextField
            required
            fullWidth
            id="filled-required"
            hiddenLabel
            margin="dense"
            variant="filled"
            size="small"
          />
        </Box>
        <Box className="form-field">
          <Typography>Subcategory:</Typography>
          <TextField
            fullWidth
            id="filled"
            hiddenLabel
            margin="dense"
            variant="filled"
            size="small"
          />
        </Box>
        <Box className="form-field">
          <Typography>*Count:</Typography>
          <TextField
            id="filled-number"
            fullWidth
            hiddenLabel
            margin="dense"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            variant="filled"
            size="small"
          />
        </Box>
        <Box className="form-field">
          <Typography>*Location:</Typography>
          <TextField
            required
            fullWidth
            id="filled-required"
            hiddenLabel
            margin="dense"
            variant="filled"
            size="small"
          />
        </Box>
        <Box className="form-field">
          <Typography>Sublocation:</Typography>
          <TextField
            fullWidth
            id="filled"
            hiddenLabel
            margin="dense"
            variant="filled"
            size="small"
          />
        </Box>
        <Box className="form-field">
          <Typography>Serial No:</Typography>
          <TextField
            fullWidth
            id="filled"
            hiddenLabel
            margin="dense"
            variant="filled"
            size="small"
          />
        </Box>
        <Box className="form-field">
          <Typography>Notes:</Typography>
          <TextField
            fullWidth
            id="filled"
            hiddenLabel
            margin="dense"
            variant="filled"
            size="small"
          />
        </Box>
        <Box className="form-field">
          <Typography>Description:</Typography>
          <TextField
            multiline
            fullWidth
            id="filled"
            hiddenLabel
            margin="dense"
            variant="filled"
            size="small"
          />
        </Box>
      </Box>
    </Modal>
  );
};
export default AssetAddModal;
