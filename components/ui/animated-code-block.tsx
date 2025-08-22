"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Play, Terminal } from "lucide-react";

interface AnimatedCodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showCopy?: boolean;
  showRun?: boolean;
  onRun?: () => void;
  className?: string;
}

export function AnimatedCodeBlock({
  code,
  language = "text",
  title,
  showCopy = true,
  showRun = false,
  onRun,
  className = "",
}: AnimatedCodeBlockProps) {
  const [displayedCode, setDisplayedCode] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < code.length) {
        setDisplayedCode(code.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 30); // Typing speed

    return () => clearInterval(timer);
  }, [code]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = async () => {
    if (!onRun) return;
    setIsRunning(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onRun();
    setIsRunning(false);
  };

  return (
    <div className={`glass-effect rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-black/50 border-b border-lead-gray/30">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-gold-industrial" />
            <span className="text-sm font-medium text-white">{title}</span>
            {language && (
              <span className="text-xs text-lead-gray bg-lead-gray/20 px-2 py-1 rounded">
                {language.toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showRun && (
              <Button
                onClick={handleRun}
                disabled={isRunning}
                size="sm"
                variant="ghost"
                className="text-green-400 hover:text-green-300"
              >
                {isRunning ? (
                  <div className="animate-spin w-3 h-3 border border-green-400 border-t-transparent rounded-full" />
                ) : (
                  <Play className="w-3 h-3" />
                )}
              </Button>
            )}

            {showCopy && (
              <Button
                onClick={handleCopy}
                size="sm"
                variant="ghost"
                className="text-lead-gray hover:text-white"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="relative">
        <pre className="p-4 text-sm text-white font-mono overflow-x-auto bg-black/30">
          <code>
            {displayedCode}
            {isTyping && (
              <span className="animate-pulse text-gold-industrial">|</span>
            )}
          </code>
        </pre>

        {isRunning && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="flex items-center gap-3 text-green-400">
              <div className="animate-spin w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full" />
              <span className="text-sm font-medium">Executing...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
