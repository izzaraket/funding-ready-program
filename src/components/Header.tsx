import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  showHome?: boolean;
  backTo?: string;
}

const Header: React.FC<HeaderProps> = ({ showHome, backTo }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-border px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {backTo && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(backTo)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          <a
            href="https://yammservices.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img
              src="/yamm-logo.png"
              alt="YAMM Services"
              className="h-10 w-auto"
            />
          </a>
        </div>
        {showHome && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
