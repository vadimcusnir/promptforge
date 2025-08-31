import * as React from 'react';
export function Tooltip({label,children}:{label:string,children:React.ReactNode}){
  return <span title={label} style={{textDecoration:'inherit'}}>{children}</span>;
}
