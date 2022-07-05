import * as React from "react";
import { DataTable } from "DataTable";
import { DashTopBar } from "./DashTopBar"
import Box from '@mui/material/Box';

export const Dashboard = () => {
    return (
        <Box sx={{ paddingTop: 10, paddingRight: 10, paddingLeft: 10 }}>
            <DashTopBar/>
            <DataTable />
        </Box>
   )
}
