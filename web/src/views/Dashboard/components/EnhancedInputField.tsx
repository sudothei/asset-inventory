import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Controller, Control } from "react-hook-form";
import AssetRequest from "types/AssetRequest";

interface EnhancedInputFieldRequiredProps {
  label: string;
  name: keyof AssetRequest;
  control: Control<AssetRequest, object>;
}
interface EnhancedInputFieldOptionalProps {
  type?: "number" | "text";
  required?: boolean;
  multiline?: boolean;
  rules?: object;
}
interface EnhancedInputFieldProps
  extends EnhancedInputFieldRequiredProps,
    EnhancedInputFieldOptionalProps {}
const defaultProps: EnhancedInputFieldOptionalProps = {
  type: "text",
  required: false,
  multiline: false,
  rules: {},
};

const EnhancedInputField = (props: EnhancedInputFieldProps) => {
  const { name, required, label, type, control, multiline, rules } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
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
