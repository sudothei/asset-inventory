import * as React from "react";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import Asset from "types/Asset";

interface AssetEditModalProps {
  open: boolean;
  handleClose: () => void;
  asset: Asset | undefined;
}

const AssetEditModal = (props: AssetEditModalProps) => {
  const { open, handleClose, asset } = props;

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
          <Typography>Object ID:</Typography>
          <TextField
            required
            fullWidth
            id="filled-read-only-input"
            hiddenLabel
            defaultValue={asset ? asset._id.$oid : null}
            margin="dense"
            variant="filled"
            size="small"
          />
        </Box>
        <Box className="form-field">
          <Typography>*Name:</Typography>
          <TextField
            required
            defaultValue={asset ? asset.name : null}
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
            defaultValue={asset ? asset.vendor : null}
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
            defaultValue={asset ? asset.assetno : null}
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
            defaultValue={asset ? asset.category : null}
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
            defaultValue={asset ? asset.subcategory : null}
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
            defaultValue={asset ? asset.count : null}
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
            defaultValue={asset ? asset.location : null}
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
            defaultValue={asset ? asset.sublocation : null}
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
            defaultValue={asset ? asset.serialno : null}
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
            defaultValue={asset ? asset.notes : null}
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
            defaultValue={asset ? asset.description : null}
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
export default AssetEditModal;
