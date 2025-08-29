import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User, LayoutDashboard, FileText, Calendar, XCircle, UserCircle, HelpCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/ff2104f3-6482-49a4-9fec-6fd1d70a2204/c4a62877bf18a6bbdd6ac8a9a25455d7.png";

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Intimações', icon: FileText, path: '/intimacoes' },
  { name: 'Agenda', icon: Calendar, path: '/agenda' },
  { name: 'Glossário', icon: Calendar, path: '/glossario' },
  { name: 'Orientações', icon: XCircle, path: '/orientacoes' },
  { name: 'Perfil', icon: UserCircle, path: '/perfil' },
  { name: 'Suporte', icon: HelpCircle, path: '/suporte' },
];

export function Sidebar() {
  const { user, signOut } = useAuth();

  return (
    <aside className="w-64 flex-shrink-0 bg-card/60 border-r border-border flex flex-col p-4">
      <div className="flex items-center space-x-3 mb-10 px-2">
        <img src={logoUrl} alt="IntimAI Logo" className="h-8" />
      </div>


      <nav className="flex-1 space-y-2 mt-10">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${
                isActive
                  ? 'text-gradient-light'
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-5 h-5 mr-3 transition-colors duration-200 ease-in-out ${isActive ? 'text-gradient-light' : ''}`}
                />
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col space-y-2 pt-4 border-t border-border">
          <NavLink
            to="/politica-de-privacidade"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${
                isActive
                  ? 'text-gradient-light'
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <ShieldCheck
                  className={`w-5 h-5 mr-3 transition-colors duration-200 ease-in-out ${isActive ? 'text-gradient-light' : ''}`}
                />
                <span>Política de Privacidade</span>
              </>
            )}
          </NavLink>
          <Button variant="ghost" onClick={signOut} className="w-full justify-start px-3 py-2 text-muted-foreground hover:text-foreground text-sm font-medium h-auto">
            <LogOut className="w-5 h-5 mr-3" />
            <span>Sair</span>
          </Button>
        </div>
    </aside>
  );
}