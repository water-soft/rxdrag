import React, { useEffect } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Grid} from '@material-ui/core';
import Scrollbar from 'Common/Scrollbar';
import { MediaGridListImage } from './MediaGridListImage';
import { useShowServerError } from 'Store/Helpers/useInfoError';
import { observer } from 'mobx-react';
import { MediaSort, useMediasStore } from './MediasStore';
import { MediaGridListFolders } from './MediaGridListFolders';
import { MediaGridListTasks } from './MediaGridListTasks';
import { MediaStore } from './MediaStore';
import { FolderNode } from './FolderNode';
import { MagicQueryBuilder } from 'Data/MagicQueryBuilder';
import { useMagicQueryInfinite } from 'Data/useMagicQueryInfinite';
import { RxMedia } from './constants';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: 1,
      padding:theme.spacing(0, 2, 0, 2),
      //修改滚动bug添加，需要确认单独一个页面时，该改动是否影响
      height:0,
    },

    scrollBar:{
      paddingBottom:theme.spacing(2),
      paddingRight:theme.spacing(0.2),
      paddingTop:theme.spacing(0.2),
    },

    gridList: {
      flex:1,
    },
    icon: {
      color: 'rgba(255, 255, 255, 0.54)',
    },

    progress:{
      textAlign:'center',
      padding:theme.spacing(10),
      justifyContent:'center',
      alignItems:'center',
      display:'flex',
      minHeight:'200px',
    }
  }),
);

const PAGE_SIZE = 10;

export const MediaGridList = observer((
  props:{
    onMoveMedia:(media:MediaStore, folder:FolderNode)=>void
  }
)=>{
  const {onMoveMedia} = props;
  const classes = useStyles();
  const mediasStore = useMediasStore();
  
  const getKey = (pageIndex: any, previousPageData: any)=>{
    if(previousPageData && !previousPageData.data?.length){
      return null;
    }
    let orderField = ['createdAt', 'DESC'];
    if(mediasStore.sortBy === MediaSort.ASC_BY_CREATE_AT){
      orderField = ['createdAt', 'ASC'];
    }
    if(mediasStore.sortBy === MediaSort.ASC_BY_NAME){
      orderField = ['name', 'ASC'];
    }
    if(mediasStore.sortBy === MediaSort.DESC_BY_NAME){
      orderField = ['name', 'DESC'];
    }

    const builder = new MagicQueryBuilder()
      .setModel(RxMedia)
    if(mediasStore.keyword?.trim()){
      builder.addCondition('name', `%${mediasStore.keyword?.trim()}%`, 'like')
    }
      
    builder.setOrderBy(orderField[0], orderField[1])
      .setPageSize(PAGE_SIZE)
      .setPageIndex(pageIndex);
    return builder.toAxioConfig().url||null;
  }

  const { data, error, mutate, size, setSize, isValidating } = useMagicQueryInfinite(getKey, {persistSize:true});
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.data?.length < PAGE_SIZE);
  const isLoading = isValidating && data && data.length === size;

  useEffect(()=>{
    mediasStore.setMedias(data ? [].concat(...data.map(data=>data.data)) : []);
  }, [data, mediasStore])

  useShowServerError(error);

  const handleScroll = (scrollRef: React.RefObject<HTMLDivElement>)=>{
    let divElement = scrollRef.current;
    let scrollRect = divElement?.getBoundingClientRect();
    if(divElement 
      && scrollRect 
      && (divElement?.scrollHeight - (divElement?.scrollTop + scrollRect?.height) <= 50) 
      && !isLoadingMore
      && !isLoading 
      && !isReachingEnd){
      setSize(size + 1);
    }
    //e.defaultPrevented();
  }

  const handleDragOver = (event:React.DragEvent<HTMLElement>)=>{
    event.preventDefault();
    event.stopPropagation();
  }

  const handleDrop = (event:React.DragEvent<HTMLElement>)=>{
    if(event.dataTransfer.files){
      mediasStore.addUploadFiles(event.dataTransfer.files);
    }
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <Scrollbar permanent 
      className={classes.scrollBar} 
      onScroll = {handleScroll}
      onDragOver = {handleDragOver}
      onDrop = {handleDrop}
    >
      <Grid 
        container 
        className={classes.root} 
        spacing={2} 
      >
        <MediaGridListFolders onMoveMedia = {onMoveMedia} />
        <MediaGridListTasks onFinishUpload = {mutate} />
     
        {mediasStore.medias?.map((media:MediaStore, index) => (
          <Grid item key={media.id + '-image-' + index + '-' + media.name} lg={2} sm={3} xs={4}>
            <MediaGridListImage media = {media} onRemoved = {mutate}/>
          </Grid>
        ))}
        {
          (isLoadingInitialData || isLoadingMore) &&
          <Grid item className = {classes.progress} xs={true}>
            <CircularProgress />
          </Grid>
        }
      </Grid>
    </Scrollbar>
  );
})
