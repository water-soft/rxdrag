import * as React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import { useQuery } from '@apollo/react-hooks';
import { GET_RX_TEMPLATES } from 'Base/GraphQL/GQLs';
import intl from 'react-intl-universal';
import { Divider, DialogContent, Grid, DialogActions, TextField, Button } from '@material-ui/core';
import RxDialog from 'AppStudio/RxDialog';
import { IRXTemplate } from 'Base/Model/IRXTemplate';
import { useShowAppoloError } from 'Store/Helpers/useInfoError';
import TemplatesSkeleton from './TemplatesSkeleton';
import { useState } from 'react';
import Image from 'Components/Common/Image';
import classNames from 'classnames';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content:{
      flex:1,
      minHeight:'300px',
    },
    actions:{
      display:'flex',
      justifyContent:'space-between',
      padding:theme.spacing(2),
    },
    pageName:{
      minWidth:'260px',
    },
    buttons:{

    },
    confirmButton:{
      marginLeft:theme.spacing(2),
    },
    image:{
      border:theme.palette.divider + ' solid 1px',
      '&:hover':{
        outline: theme.palette.primary.main + ' solid 1px',
      }
    },
    selected:{
      outline: theme.palette.primary.main + ' solid 2px',
      '&:hover':{
        outline: theme.palette.primary.main + ' solid 2px',
      }
    },
    templateGrid:{
      display:'flex',
      flexFlow:'column',
      cursor: 'pointer',
    },
    templateName:{
      flex:1,
      display:'flex',
      justifyContent: 'center',
      alignItems : 'center',
      padding:theme.spacing(1),
      fontSize:'1.1rem',
    }
  }),
);


export const TemplatesDialog = observer((
  props:{
    open:boolean,
    onClose:()=>void,
  }
) => {
  const {open, onClose} = props;
  const classes = useStyles();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(''); 
  const [selectedId, setSelectedId] = useState('');
  const {loading, data, error} = useQuery(GET_RX_TEMPLATES);
  useShowAppoloError(error);

  const templates = data?.rxTemplates;

  const handleClose = ()=>{
    onClose();
    setName('');
    setNameError('');
  }

  const handelNameChange = (event:React.ChangeEvent<HTMLInputElement>)=>{
    const newValue = event.target.value as string;
    if(newValue){
      setNameError('');
    }

    setName(newValue);
  }

  const handleConfirm = ()=>{
    if(!name){
      setNameError(intl.get('required'));
      return;
    }
  }

  
  return (
    <RxDialog 
      open = {open}
      title = {intl.get('add-new-page')}
      onClose = {handleClose}
      maxWidth = "sm"
    >
      <Divider />
      <DialogContent className={classes.content}>
        {
          loading
          ? <TemplatesSkeleton />
          : <Grid container spacing = {2}>
              {
                templates?.map((template:IRXTemplate)=>{
                  return(
                    <Grid 
                      key={template.id} item  md={4} 
                      className = {classes.templateGrid}
                      onClick={()=>{setSelectedId(template.id)}}
                    >
                      <Image 
                        src = {template.thumbnail} 
                        className={
                          classNames(classes.image,{[classes.selected]:selectedId === template.id})
                        }
                      />
                      <div className = {classes.templateName}>{template.name}</div>
                    </Grid>
                  )
                })
              }
            </Grid>
        }
      </DialogContent>
      <Divider />
      <DialogActions className = {classes.actions}>
          <TextField 
            className={classes.pageName} 
            variant = "outlined" 
            size="small" 
            label = {intl.get('page-name')}
            error = {!!nameError}
            helperText = {nameError}
            onChange = {handelNameChange}
          />    
          <div className = {classes.buttons}>
            <Button 
              variant = "outlined"
              onClick = {handleClose}
            >
              {intl.get('cancel')}
            </Button>
            <Button 
              className = {classes.confirmButton} 
              variant = "contained" 
              color = "primary"
              onClick = {handleConfirm}
            >
              {intl.get('confirm')}
            </Button>
          </div>
        </DialogActions>   
    </RxDialog>
  );
})