import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import items from './items'
import { INode } from 'designer/PageEditor/Core/Node/INode';
import TreeView from '@material-ui/lab/TreeView';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { RXNode } from 'base/RXNode/RXNode';
import { IToolboxItem } from './IToolboxItem';
import { RXNodeRoot } from 'base/RXNode/Root';
import TreeNode from './TreeNode';

declare var window: {draggedNode:INode};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      padding: theme.spacing(2),
    },
    treeItemLabel: {
      fontSize:'0.9rem',
      padding:theme.spacing(1,0),
      cursor:'default',
    },

    title:{
      paddingLeft:theme.spacing(1),
    }
  }),
);


export default function Toolbox() {
  const classes = useStyles();
  const [root, setRoot] = useState<RXNodeRoot<IToolboxItem>>();
  
  useEffect(()=>{
    let aRoot = new RXNodeRoot<IToolboxItem>();
    aRoot.parse(JSON.parse(JSON.stringify(items)));
    setRoot(aRoot);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
      <TreeView
        className={classes.root}
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        disableSelection
        style={{
          width: '100%',
        }}
      >
        {
          root?.children.map((node:RXNode<IToolboxItem>)=>{
            return (
              <TreeNode key={node.id + ''} node={node} />
            )
          })
        }
      </TreeView>      
   );
}