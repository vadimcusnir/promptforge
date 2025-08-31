export function DifficultyMeter({level}:{level:1|2|3|4|5}){
  const label={1:'Beginner',2:'Beginner+',3:'Intermediate',4:'Advanced',5:'Expert'}[level];
  return <div role="meter" aria-valuenow={level} aria-valuemin={1} aria-valuemax={5} aria-label={`Difficulty ${label}`}>
    {'★★★★★'.slice(0,level)}{'☆☆☆☆☆'.slice(level)}
    <span style={{marginLeft:8,opacity:.7}}>{label}</span>
  </div>;
}
