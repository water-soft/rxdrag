import React, { Fragment } from 'react';
import { makeStyles, Theme, createStyles, IconButton, Divider, ListItemIcon, Menu, MenuItem } from '@material-ui/core';
import MdiIcon from 'Components/Common/MdiIcon';
import intl from 'react-intl-universal';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width:'32px',
      height: '32px',
    },

    menuItem:{
      padding:theme.spacing(1, 3),
    },

  }),
);

export default function PageAction(
  props:{
    onCloseMenu?:()=>void
  }
){
  const {onCloseMenu} = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    onCloseMenu && onCloseMenu();
  };
  return (
    <Fragment>
      <IconButton size="small" className = {classes.root} onClick={handleMenuOpen}>
        <MdiIcon iconClass = "mdi-dots-horizontal" size={18}/>
      </IconButton>
      <Menu
          anchorEl={anchorEl}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={isMenuOpen}
          onClose={handleMenuClose}
          
        >
          <MenuItem onClick={handleMenuClose} className = {classes.menuItem}>
            <ListItemIcon>
              <MdiIcon iconClass = "mdi-pencil"  size={18}/>
            </ListItemIcon>
            {intl.get('edit')+intl.get('name')} 
          </MenuItem>
          <MenuItem onClick={handleMenuClose} className = {classes.menuItem}>
            <ListItemIcon>
              <MdiIcon iconClass = "mdi-content-copy"  size={18}/>
            </ListItemIcon>
            {intl.get('duplicate')} 
          </MenuItem>
          <Divider/>
          <MenuItem className = {classes.menuItem} onClick={handleMenuClose}>
            <ListItemIcon>
              <MdiIcon iconClass = "mdi-delete-forever" color={'red'} size={18}/>
            </ListItemIcon>
            {intl.get('delete')} 
          </MenuItem>
        </Menu>
    </Fragment>
  )
}
