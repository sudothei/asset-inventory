import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import { Controller } from "react-hook-form";

interface EnhancedSwitchProps {
  label: string;
  name: string;
  control: any;
}

const EnhancedSwitch = (props: EnhancedSwitchProps) => {
  const { name, label, control } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value }
      }) => (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography sx={{minWidth: "15ch", textAlign: "enc", paddingRight: "1ch"}}>{`${label}:`}</Typography>
          <Box sx={{width: "100%", maxWidth: 450}}>
              <Switch
                size="medium"
                onChange={onChange}
                value={value}
                color="secondary"
              />
          </Box>
        </Box>
      )}
    />
  );
};
export default EnhancedSwitch;
