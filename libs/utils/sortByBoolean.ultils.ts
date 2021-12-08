export const sortBoolean = (array: any[]): any => {
    array.sort((x,y) =>{
      if(x.isSelect){
        return (x.isSelect === y.isSelect) ? 0 : x ? -1 : 1;
      }else{
        return (x.isSelect === y.isSelect) ? 1 : x ? 1 : -1;
      }
    })
  return array
};
