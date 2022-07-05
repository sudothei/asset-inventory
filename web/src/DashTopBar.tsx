import * as React from "react";
import {useState} from "react";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';

import MenuIcon from '@mui/icons-material/Menu';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import AddBoxIcon from '@mui/icons-material/AddBox';

const TopBar = () => {
    const [filterOn, setFilterOn] = useState(false);

    const handleFilterClick = () => {
        setFilterOn(!filterOn);
    }

    return (
          <AppBar position="fixed">
            <Toolbar sx={{ flex: '1' }}>
              <Box sx={{ display: 'flex', flexFlow: 'row', flex: '1', justifyContent: 'flex-start' }}>
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" component="div" sx={{ alignSelf: 'center' }}>
                    Inventory Asset DB
                  </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', flex: '1', alignItems: 'center' }}>
                  <IconButton>
                  {filterOn ? (
                    <FilterAltIcon
                        fontSize="large"
                        color="secondary"
                        onClick={handleFilterClick}
                    />
                          ) : (
                    <FilterAltOffIcon
                        fontSize="large"
                        color="secondary"
                        onClick={handleFilterClick}
                        />
                              )
                  }
                  </IconButton>
                  <Input color="secondary" sx={{ input: {textAlign: 'center'} }} placeholder="Search"/>
                  <IconButton>
                      <AddBoxIcon fontSize="large" color="secondary"/>
                  </IconButton>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: '1' }}>
                  <Button color="inherit">Login</Button>
              </Box>
            </Toolbar>
          </AppBar>
           )
}

export default TopBar
