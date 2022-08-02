import * as React from "react";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "hooks";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Checkbox from "@mui/material/Checkbox";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import EnhancedTableHead from "./components/AssetTableHead";
import AssetNav from "./components/AssetNav";
import AssetEditModal from "./components/AssetEditModal";

import getComparator from "helpers/getComparator";
import getAssets from "thunks/getAssets";
import deleteAssets from "thunks/deleteAssets";

import Order from "types/Order";
import Asset from "types/Asset";
import AssetRequired from "types/AssetRequired";
import { RootState } from "store";

const Assets = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAssets());
  }, []);

  const assets: Asset[] = useAppSelector((state: RootState) => state.assets);

  // For sorting assets by column
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof AssetRequired>("name");
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof AssetRequired
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // For filtering assets with search
  const [searchterm, setSearchterm] = useState<string>("");
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchterm(event.target.value);
  };
  const filterByTerm = (object: Object): Boolean => {
    let result = false;
    Object.values(object).forEach((value) => {
      try {
        if (value.toString().toLowerCase().includes(searchterm.toLowerCase()))
          result = true;
      } catch {
        if (value) {
          if (filterByTerm(value)) result = true;
        }
      }
    });
    return result;
  };

  // For deleting selected assets
  const handleDelete = () => {
    console.log(selected);
    dispatch(deleteAssets(selected));
  };

  // For selecting assets
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = assets
        .filter(filterByTerm)
        .map((n: Asset) => n._id.$oid);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  };
  const handleCheckboxClick = (
    event: React.MouseEvent<unknown>,
    oid: string
  ) => {
    const selectedIndex = selected.indexOf(oid);
    let newSelected: string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, oid);
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
  const isSelected = (oid: string) => selected.indexOf(oid) !== -1;

  // for table to fill container properly
  const [tableHeight, setTableHeight] = useState(0);
  useEffect(() => {
    const height = window.innerHeight - 64 - 20;
    setTableHeight(height);
    const onResize = () => {
      const height = window.innerHeight - 64 - 20;
      setTableHeight(height);
    };
    window.removeEventListener("resize", onResize);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // For the asset edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<Asset | undefined>();
  const handleRowClick = (event: React.MouseEvent<unknown>, oid: string) => {
    const target = event.target as HTMLInputElement;
    if (target.type !== "checkbox") {
      setCurrentAsset(() => getAssetByID(oid));
      setEditModalOpen(true);
    }
  };
  const getAssetByID = (oid: string) =>
    assets.filter((x: Asset) => x._id.$oid === oid)[0];

  return (
    <Box sx={{ paddingTop: 10, paddingRight: 10, paddingLeft: 10 }}>
      <AssetNav onDelete={handleDelete} onSearch={handleSearch} />
      <AssetEditModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        asset={currentAsset}
      />
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: tableHeight, overflow: "auto" }}>
          <Table stickyHeader aria-label="sticky table" size="small">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={assets.length}
            />
            <TableBody>
              {assets
                .slice()
                .sort(getComparator(order, orderBy))
                .filter(filterByTerm)
                .map((asset: Asset, index: number) => {
                  const isItemSelected = isSelected(asset._id.$oid);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleRowClick(event, asset._id.$oid)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={asset._id.$oid}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="secondary"
                          onClick={(event) =>
                            handleCheckboxClick(event, asset._id.$oid)
                          }
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={asset._id.$oid}
                        scope="row"
                        padding="none"
                      >
                        {asset.name}
                      </TableCell>
                      <TableCell>{asset.assetno}</TableCell>
                      <TableCell align="right">{asset.vendor}</TableCell>
                      <TableCell align="right">{asset.category}</TableCell>
                      <TableCell align="right">{asset.count}</TableCell>
                      <TableCell align="right">{asset.location}</TableCell>
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

export default Assets;
