import { gql } from "@apollo/react-hooks";

export const QUERY_FOLDERS = gql`
  query {
    rxMediaFoldersTree
  }
`;
export const QUERY_MEDIAS = gql`
  query ($first:Int!, $page:Int, $name:String){
    rxMedias(first:$first, page:$page, name:$name, orderBy: [{ column: CREATED_AT, order: ASC }]){
      data{
        id
        thumbnail
        name
        src
      }
      paginatorInfo{
        currentPage
        hasMorePages
      }      
    }
  }
`;
export const MUTATION_ADD_FOLDER = gql`
  mutation ($parent_id:ID, $name:String){
    addRxMediaFolder(parent_id:$parent_id, name:$name){
      id
      name
      parent_id
    }
  }
`;

export const MUTATION_UPDATE_FOLDER = gql`
  mutation ($id:ID, $name:String, $parent_id:ID){
    updateRxMediaFolder(id:$id, name:$name, parent_id:$parent_id){
      id
      name
    }
  }
`;

export const MUTATION_REMOVE_FOLDER = gql`
  mutation ($id:ID!){
    removeRxMediaFolder(id:$id){
      id
      name
    }
  }
`;

export const MUTATION_UPDATE_MEDIA = gql`
  mutation ($media:MediaInput!){
    updateRxMedia(media:$media){
      id
    }
  }
`;

export const MUTATION_REMOVE_MEDIAS = gql`
  mutation ($ids:[ID]){
    removeRxMedias(ids:$ids){
      ids
    }
  }
`;