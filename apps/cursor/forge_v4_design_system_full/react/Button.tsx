import * as React from 'react';
type Variant='primary'|'ghost'|'danger';
export function Button({variant='primary',disabled=false,children,...rest}:{variant?:Variant}&React.ButtonHTMLAttributes<HTMLButtonElement>){
  const cls=['btn',`btn--${variant}`,disabled?'opacity-60 cursor-not-allowed':'' ].join(' ');
  return <button className={cls} disabled={disabled} {...rest}>{children}</button>;
}