'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0.1,
      }
    );

    // Observe all sections
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      items.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [items]);

  return (
    <nav className="bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg p-4">
      <h2 className="font-sans text-lg font-semibold text-white mb-4">
        Table of Contents
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`#${item.id}`}
              className={`block py-2 px-3 rounded-md transition-colors font-sans text-sm ${
                activeId === item.id
                  ? 'text-[#d1a954] bg-[#2a2a2a] border-l-2 border-[#d1a954]'
                  : 'text-[#a0a0a0] hover:text-white hover:bg-[#2a2a2a]'
              }`}
              style={{ paddingLeft: `${item.level * 12 + 12}px` }}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
