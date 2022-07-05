import * as React from "react";
import {useState, useEffect} from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Checkbox from '@mui/material/Checkbox'
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { EnhancedTableHead } from "EnhancedTableHead";

type Order = 'asc' | 'desc';
interface Data {
  id: number,
  name: string;
  partno: string;
  vendor: string;
  category: string;
  count: number;
  location: string;
}
function createData(
  id: number,
  name: string,
  partno: string,
  vendor: string,
  category: string,
  count: number,
  location: string,
): Data {
  return { id, name, partno, vendor, category, count, location };
}
const rows = [
  createData(12435, '10Gb Optics', '124-56xd', 'Uber', 'Light Optics', 9, 'Charlotte'),
  createData(12531, '8Gb HD', '124-56xd', 'Dragon', 'Hard Drives', 100, 'Charlotte'),
  createData(15423, 'Audiophile Headphones', '6XX', 'Sennheiser', 'Headphone', 1, 'Charlotte'),
  createData(12431, 'Micromix', '123-45', 'Behringer', 'Mixers', 2, 'Charlotte'),
  createData(1, '10Gb Optics', '124-56xd', 'Uber', 'Light Optics', 9, 'Charlotte'),
  createData(2, '8Gb HD', '124-56xd', 'Dragon', 'Hard Drives', 100, 'Charlotte'),
  createData(3, 'Audiophile Headphones', '6XX', 'Sennheiser', 'Headphone', 1, 'Charlotte'),
  createData(4, 'Micromix', '123-45', 'Behringer', 'Mixers', 2, 'Charlotte'),
  createData(5, '10Gb Optics', '124-56xd', 'Uber', 'Light Optics', 9, 'Charlotte'),
  createData(6, '8Gb HD', '124-56xd', 'Dragon', 'Hard Drives', 100, 'Charlotte'),
  createData(7, 'Audiophile Headphones', '6XX', 'Sennheiser', 'Headphone', 1, 'Charlotte'),
  createData(8, 'Micromix', '123-45', 'Behringer', 'Mixers', 2, 'Charlotte'),
  createData(9, '10Gb Optics', '124-56xd', 'Uber', 'Light Optics', 9, 'Charlotte'),
  createData(10, '8Gb HD', '124-56xd', 'Dragon', 'Hard Drives', 100, 'Charlotte'),
  createData(11, 'Audiophile Headphones', '6XX', 'Sennheiser', 'Headphone', 1, 'Charlotte'),
  createData(12, 'Micromix', '123-45', 'Behringer', 'Mixers', 2, 'Charlotte'),
  createData(13, '10Gb Optics', '124-56xd', 'Uber', 'Light Optics', 9, 'Charlotte'),
  createData(14, '8Gb HD', '124-56xd', 'Dragon', 'Hard Drives', 100, 'Charlotte'),
  createData(15, 'Audiophile Headphones', '6XX', 'Sennheiser', 'Headphone', 1, 'Charlotte'),
  createData(16, 'Micromix', '123-45', 'Behringer', 'Mixers', 2, 'Charlotte'),
  createData(17, '10Gb Optics', '124-56xd', 'Uber', 'Light Optics', 9, 'Charlotte'),
  createData(18, '8Gb HD', '124-56xd', 'Dragon', 'Hard Drives', 100, 'Charlotte'),
  createData(19, 'Audiophile Headphones', '6XX', 'Sennheiser', 'Headphone', 1, 'Charlotte'),
  createData(20, 'Micromix', '123-45', 'Behringer', 'Mixers', 2, 'Charlotte'),
  createData(21, '10Gb Optics', '124-56xd', 'Uber', 'Light Optics', 9, 'Charlotte'),
  createData(22, '8Gb HD', '124-56xd', 'Dragon', 'Hard Drives', 100, 'Charlotte'),
  createData(23, 'Audiophile Headphones', '6XX', 'Sennheiser', 'Headphone', 1, 'Charlotte'),
  createData(24, 'Micromix', '123-45', 'Behringer', 'Mixers', 2, 'Charlotte'),
  createData(25, '10Gb Optics', '124-56xd', 'Uber', 'Light Optics', 9, 'Charlotte'),
  createData(26, '8Gb HD', '124-56xd', 'Dragon', 'Hard Drives', 100, 'Charlotte'),
  createData(27, 'Audiophile Headphones', '6XX', 'Sennheiser', 'Headphone', 1, 'Charlotte'),
  createData(28, 'Micromix', '123-45', 'Behringer', 'Mixers', 2, 'Charlotte'),
  createData(29, '10Gb Optics', '124-56xd', 'Uber', 'Light Optics', 9, 'Charlotte'),
  createData(30, '8Gb HD', '124-56xd', 'Dragon', 'Hard Drives', 100, 'Charlotte'),
  createData(31, 'Audiophile Headphones', '6XX', 'Sennheiser', 'Headphone', 1, 'Charlotte'),
  createData(32, 'Micromix', '123-45', 'Behringer', 'Mixers', 2, 'Charlotte'),
  createData(33, '10Gb Optics', '124-56xd', 'Uber', 'Light Optics', 9, 'Charlotte'),
  createData(44, '8Gb HD', '124-56xd', 'Dragon', 'Hard Drives', 100, 'Charlotte'),
  createData(55 , 'Audiophile Headphones', '6XX', 'Sennheiser', 'Headphone', 1, 'Charlotte'),
  createData(66, 'Micromix', '123-45', 'Behringer', 'Mixers', 2, 'Charlotte'),
  createData(77, '10Gb Optics', '124-56xd', 'Uber', 'Light Optics', 9, 'Charlotte'),
  createData(88, '8Gb HD', '124-56xd', 'Dragon', 'Hard Drives', 100, 'Charlotte'),
  createData(99, 'Audiophile Headphones', '6XX', 'Sennheiser', 'Headphone', 1, 'Charlotte'),
  createData(100, 'Micromix', '123-45', 'Behringer', 'Mixers', 2, 'Charlotte'),
];

function descendingComparator<Type>(a: Type, b: Type, orderBy: keyof Type) {

  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};


function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

export const DataTable = () => {

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('name');
  const [selected, setSelected] = React.useState<readonly string[]>([]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id.toString());
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

    // for table to fill container properly
    const [tableHeight, setTableHeight] = useState(0)
    useEffect(() => {
        const height = window.innerHeight - 64 - 20;
        setTableHeight(height);
        const onResize = () => {
            const height = window.innerHeight - 64 - 20;
            setTableHeight(height);
        }
        // clean up
        window.removeEventListener('resize', onResize);
        window.addEventListener('resize', onResize, { passive: true });
        return () => window.removeEventListener('resize', onResize);
    }, []);
    
    return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: tableHeight, overflow: 'auto' }}>
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
              {rows.sort(getComparator(order, orderBy))
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id.toString());
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id.toString())}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
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
   )
}
