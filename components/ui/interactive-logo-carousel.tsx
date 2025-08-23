'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface LogoCarouselItem {
  name: string;
  logo: string;
  caseStudy?: {
    title: string;
    description: string;
    url: string;
  };
}

interface InteractiveLogoCarouselProps {
  items: LogoCarouselItem[];
  className?: string;
}

export function InteractiveLogoCarousel({ items, className = '' }: InteractiveLogoCarouselProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className={`logo-carousel-container ${className}`}>
      <div className="logo-carousel-gradient left"></div>
      <div className="logo-carousel-gradient right"></div>

      <div className="wrap-logos">
        {items.map((item, index) => (
          <div
            key={index}
            className="logo-carousel-item"
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {item.caseStudy && hoveredItem === item.name && (
              <div className="logo-carousel-hover">
                <div className="logo-carousel-container">
                  <div className="p small medium">{item.caseStudy.description}</div>
                  <a
                    href={item.caseStudy.url}
                    className="logo-carousel-button"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Badge variant="secondary" className="bg-gold-industrial text-black">
                      CASE STUDY
                    </Badge>
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </a>
                </div>
                <div className="icon-logo-carousel-dropdown">
                  <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                    <path d="M6 0L0 6H12L6 0Z" fill="var(--color--bg-primary)"></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 6H12L6 0L0 6ZM6 1.41421L1.4 6H10.6L6 1.41421Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
              </div>
            )}

            <div className="client-logo">
              <div className="text-2xl font-bold text-lead-gray hover:text-gold-industrial transition-colors">
                {item.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
