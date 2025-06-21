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

import UsersTableHead from "./components/UsersTableHead";
import UsersNav from "./components/UsersNav";
import UserEditModal from "./components/UserEditModal";

import getComparator from "helpers/getComparator";
import getUsers from "thunks/getUsers";
import deleteUsers from "thunks/deleteUsers";

import Order from "types/Order";
import User from "types/User";
import { RootState } from "store";

const Dashboard = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  const users: User[] = useAppSelector((state: RootState) => state.users);

  // For sorting users by column
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof User>("firstname");
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof User
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // For filtering users with search
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

  // For deleting selected users
  const handleDelete = () => {
    console.log(selected);
    dispatch(deleteUsers(selected));
  };

  // For selecting users
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = users
        .filter(filterByTerm)
        .map((n: User) => n._id.$oid);
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

  // For the user edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const handleRowClick = (event: React.MouseEvent<unknown>, oid: string) => {
    const target = event.target as HTMLInputElement;
    if (target.type !== "checkbox") {
      setCurrentUser(() => getUserByID(oid));
      setEditModalOpen(true);
    }
  };
  const getUserByID = (oid: string) =>
    users.filter((x: User) => x._id.$oid === oid)[0];

  return (
    <Box sx={{ paddingTop: 10, paddingRight: 10, paddingLeft: 10 }}>
      <UsersNav onDelete={handleDelete} onSearch={handleSearch} />
      <UserEditModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        user={currentUser}
      />
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: tableHeight, overflow: "auto" }}>
          <Table stickyHeader aria-label="sticky table" size="small">
            <UsersTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={users.length}
            />
            <TableBody>
              {users
                .slice()
                .sort(getComparator(order, orderBy))
                .filter(filterByTerm)
                .map((user: User, index: number) => {
                  const isItemSelected = isSelected(user._id.$oid);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleRowClick(event, user._id.$oid)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={user._id.$oid}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="secondary"
                          onClick={(event) =>
                            handleCheckboxClick(event, user._id.$oid)
                          }
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={user._id.$oid}
                        scope="row"
                        padding="none"
                      >
                        {user.firstname}
                      </TableCell>
                      <TableCell>{user.lastname}</TableCell>
                      <TableCell align="right">{user.email}</TableCell>
                      <TableCell align="right">{user.status}</TableCell>
                      <TableCell align="right">
                        {user.admin ? "Admin" : "User"}
                      </TableCell>
                      <TableCell align="right">
                        {user.write ? "Write" : "Read"}
                      </TableCell>
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

export default Dashboard;
