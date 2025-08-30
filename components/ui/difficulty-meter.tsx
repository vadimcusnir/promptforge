'use client'

import { cn } from '@/lib/utils'

interface DifficultyMeterProps {
  difficulty: 1 | 2 | 3 | 4 | 5
  className?: string
}

const difficultyLabels = {
  1: 'Beginner',
  2: 'Easy', 
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Expert'
}

const difficultyColors = {
  1: 'bg-brand',
  2: 'bg-brand/80',
  3: 'bg-gold',
  4: 'bg-gold/80',
  5: 'bg-accent'
}

export function DifficultyMeter({ difficulty, className }: DifficultyMeterProps) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className="flex space-x-1" role="meter" aria-valuenow={difficulty} aria-valuemin={1} aria-valuemax={5} aria-label={`Difficulty: ${difficultyLabels[difficulty]}`}>
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              'h-2 w-2 rounded-full transition-colors duration-200',
              level <= difficulty 
                ? difficultyColors[difficulty]
                : 'bg-border'
            )}
          />
        ))}
      </div>
      <span className="text-xs font-ui text-textMuted">
        {difficultyLabels[difficulty]}
      </span>
    </div>
  )
}
