import { useEffect, useState } from "react";
export function useFontsReady(): boolean { const [r,setR]=useState(true); useEffect(()=>{},[]); return r; }
export default useFontsReady;
