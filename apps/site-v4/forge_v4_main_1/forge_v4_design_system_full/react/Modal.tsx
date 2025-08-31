import * as React from 'react';
export function Modal({open,onClose,children}:{open:boolean,onClose:()=>void,children:React.ReactNode}){
  if(!open) return null;
  return <div role="dialog" aria-modal="true" style={{position:'fixed',inset:0,display:'grid',placeItems:'center',background:'rgba(0,0,0,.5)'}}>
    <div className="card" style={{maxWidth:860,width:'90%',padding:'24px'}}>
      <button onClick={onClose} className="btn btn--ghost" style={{float:'right'}}>✕</button>
      {children}
    </div>
  </div>;
}
