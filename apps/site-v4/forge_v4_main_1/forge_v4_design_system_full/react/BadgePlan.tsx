export function BadgePlan({plan}:{plan:'free'|'creator'|'pro'|'enterprise'}){
  const map:any={free:'FREE',creator:'CREATOR',pro:'PRO',enterprise:'ENTERPRISE'};
  return <span className="badge" aria-label={`Minimum plan: ${map[plan]}`}>{map[plan]}</span>;
}
