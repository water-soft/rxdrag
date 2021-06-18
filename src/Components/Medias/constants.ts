import { MagicQueryBuilder } from "Data/MagicQueryBuilder";

export const RxMedia = 'RxMedia';
export const RxMediaFolder = 'RxMediaFolder';
export const folderTreeQuery = new MagicQueryBuilder()
  .setModel(RxMediaFolder)
  .setTreeCommand()
  .setOrderByASC('id')