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
  type?: "number" | "input" | "password";
  required?: boolean;
  multiline?: boolean;
  rules?: object;
  readonly?: boolean;
  hidden?: boolean;
}
interface EnhancedInputFieldProps
  extends EnhancedInputFieldRequiredProps,
    EnhancedInputFieldOptionalProps {}
const defaultProps: EnhancedInputFieldOptionalProps = {
  type: "input",
  required: false,
  multiline: false,
  rules: {},
  readonly: false,
  hidden: false,
};

const EnhancedInputField = (props: EnhancedInputFieldProps) => {
  const {
    name,
    required,
    label,
    type,
    control,
    multiline,
    rules,
    readonly,
    hidden,
  } = props;

  const id = `filled${readonly ? "-read-only" : ""}${"-" + type}`;
  const labelText = readonly ? "Read Only" : required ? "Required" : "";

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Box
          sx={{
            display: hidden ? "none" : "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{ minWidth: "15ch", textAlign: "enc", paddingRight: "1ch" }}
          >{`${label}:`}</Typography>
          <TextField
            id={id}
            fullWidth
            multiline={multiline}
            label={labelText}
            margin="dense"
            type={type}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: readonly,
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
