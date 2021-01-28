import React, { Fragment, useEffect, useState } from 'react';
import { DADA_RXID_CONST, RxNode } from '../models/RxNode';
import { resolveComponent, resolveMetaConfig } from 'rx-drag/RxDrag';
import { IMeta } from 'Base/RXNode/IMeta';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import classNames from "classnames";
import { makeSpaceStyle } from 'Base/HOCs/withMargin';
import { DragoverCharger } from './DragoverCharger';
import { fade } from '@material-ui/core/styles/colorManipulator';
import {observer} from 'mobx-react';
import { useDesign } from '../store/useDesign';
import { getDomByRxid } from '../utils/getDomByRxid';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    outline: {
      outline: fade(theme.palette.primary.main, 0.8) + ' dashed 1px',
    },
    active:{
      outline: fade(theme.palette.primary.main, 0.8) + ' solid 1px',
    },
    selected:{
      outline: theme.palette.primary.main + ' solid 2px',
    },
    dragged:{
      opacity:"0.5",
      outline:theme.palette.secondary.main + ' dashed 1px',
      pointerEvents:'none',
    }
  }),
);

function getEditStyle(
  node:RxNode<IMeta>,
  showPaddingX?:boolean,
  showPaddingY?:boolean,
){
  const rule = resolveMetaConfig(node.meta.name);
  const hasNodChildren = node.children.length === 0 && !node.meta?.props?.rxText
  const paddingX={
    paddingLeft : hasNodChildren ? rule.empertyPadding : showPaddingX && rule.editPaddingX,
    paddingRight : hasNodChildren ? rule.empertyPadding : showPaddingX && rule.editPaddingX,    
  }
  const paddingY={
    paddingTop : hasNodChildren ? rule.empertyPadding : showPaddingY && rule.editPaddingY,
    paddingBottom : hasNodChildren ? rule.empertyPadding : showPaddingY && rule.editPaddingY,
  }
  return {
    ...paddingX,
    ...paddingY,
  };

}

export const ComponentView = observer((
  props:{
    node:RxNode<IMeta>,
  }
)=>{
  const {node} = props;
  const classes = useStyles();
  const [editStyle, setEditStyle] = useState<any>({});
  const {rxDragCoreStore: editorStore} = useDesign();
  let Component = resolveComponent(node.meta);

  let metaProps = node.meta.props? node.meta.props :{};
  const {
    rxText, 
    onClick, 
    className,     
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    style, 
    ...rest
  } = metaProps as any;

  const selected = editorStore?.selectedNode?.id === node.id;
  const dragged = editorStore?.draggedNode?.id === node.id;

  useEffect(()=>{
    if(editorStore?.selectedNode?.id === node.id){
      editorStore?.setSelectedDom(getDomByRxid(node.rxid));
    }
  })
  
  useEffect(()=>{
    setEditStyle(getEditStyle(node, editorStore?.showPaddingX, editorStore?.showPaddingY));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[node, node.children.length, editorStore?.showPaddingX, editorStore?.showPaddingY]);

  const handleMouseMove = (event:React.MouseEvent<HTMLElement>)=>{
    event.stopPropagation();
    let dragoverCharger = new DragoverCharger(node, editorStore?.draggedToolboxItem?.meta || editorStore?.draggedNode?.meta);
    if(editorStore?.selectedNode?.id !== node.id && !editorStore?.draggedToolboxItem && !editorStore?.draggedNode){
      editorStore?.setActiveNode(node);     
    }
    else if(editorStore?.selectedNode?.id !== node.id){
      if(editorStore?.draggedNode?.id !== node.id){
        editorStore?.setDragOverParam(dragoverCharger.judgePosition(event))
      }
    }
  }
  const handleMouseOut = (event:React.MouseEvent<HTMLElement>)=>{
    //event.stopPropagation();
    editorStore?.setActiveNode(undefined);
  }
  const handleClick = (event:React.MouseEvent<HTMLElement>)=>{
    event.stopPropagation();
    editorStore?.setSelectedNode(node);
  }

  const actived = editorStore?.activeNode?.id === node.id;

  let elementProps:any = {
    ...rest, 
    [DADA_RXID_CONST]:node.rxid,
    className:classNames(
      className, 
      {
        [classes.outline]: editorStore?.showOutline,
        [classes.active]: actived,
        [classes.selected]: selected,
        [classes.dragged]:dragged,
      }
    ),
    style:{
      ...style,
      ...editStyle,
      marginTop: makeSpaceStyle(marginTop),
      marginRight: makeSpaceStyle(marginRight),
      marginBottom: makeSpaceStyle(marginBottom),
      marginLeft: makeSpaceStyle(marginLeft),
    },
    onMouseMove: handleMouseMove,
    onMouseOut: handleMouseOut,
    onClick: handleClick,
    ...node.meta.designProps,
  }

  const elementView = (node.children && node.children.length > 0) || rxText ?
    (<Component {...elementProps}>
      {rxText}
      {node.children?.map((child: RxNode<IMeta>)=>{
        return (
          <ComponentView 
            key={child.id} 
            node={child}
          />
        )
      })}
    </Component>)
    :
    <Component {...elementProps}/>

  return(
    <Fragment>
      { elementView }
    </Fragment>
  )
})

