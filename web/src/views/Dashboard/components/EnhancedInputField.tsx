import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";

interface EnhancedInputFieldRequiredProps {
  label: string;
  name: string;
  control: any;
}
interface EnhancedInputFieldOptionalProps {
  type?: "number" | "text";
  required?: boolean;
  multiline?: boolean;
}
interface EnhancedInputFieldProps
  extends EnhancedInputFieldRequiredProps,
    EnhancedInputFieldOptionalProps {}
const defaultProps: EnhancedInputFieldOptionalProps = {
  type: "text",
  required: false,
  multiline: false,
};

const EnhancedInputField = (props: EnhancedInputFieldProps) => {
  const { name, required, label, type, control, multiline } = props;
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState,
      }) => (
        <Box className="form-field">
          <Typography>{`${label}:`}</Typography>
          <TextField
            id={`filled=${type}`}
            fullWidth
            multiline={multiline}
            label={required ? "Required" : ""}
            margin="dense"
            type={type}
            InputLabelProps={{
              shrink: true,
            }}
            variant="filled"
            helperText={error ? error.message : null}
            size="small"
            error={!!error}
            onChange={onChange}
            value={value}
          />
        </Box>
      )}
    />
  );
};

EnhancedInputField.defaultProps = defaultProps;
export default EnhancedInputField;
