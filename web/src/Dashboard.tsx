import * as React from "react";
import { useState, useEffect } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Checkbox from "@mui/material/Checkbox";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import { EnhancedTableHead } from "EnhancedTableHead";
import { DashTopBar } from "./DashTopBar";

import { Order, getComparator } from "./sortingHelpers";

// TODO replace with API call
import { rows, AssetData } from "./rows";

export const Dashboard = () => {
  // For sorting rows by column
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof AssetData>("id");
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof AssetData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // For selecting rows
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleCheckboxClick = (
    event: React.MouseEvent<unknown>,
    id: number
  ) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  // for table to fill container properly
  const [tableHeight, setTableHeight] = useState(0);
  useEffect(() => {
    const height = window.innerHeight - 64 - 20;
    setTableHeight(height);
    const onResize = () => {
      const height = window.innerHeight - 64 - 20;
      setTableHeight(height);
    };
    // clean up
    window.removeEventListener("resize", onResize);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <Box sx={{ paddingTop: 10, paddingRight: 10, paddingLeft: 10 }}>
      <DashTopBar />
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: tableHeight, overflow: "auto" }}>
          <Table stickyHeader aria-label="sticky table" size="small">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows.sort(getComparator(order, orderBy)).map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        onClick={(event) => handleCheckboxClick(event, row.id)}
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={row.id.toString()}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell>{row.partno}</TableCell>
                    <TableCell align="right">{row.vendor}</TableCell>
                    <TableCell align="right">{row.category}</TableCell>
                    <TableCell align="right">{row.count}</TableCell>
                    <TableCell align="right">{row.location}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
