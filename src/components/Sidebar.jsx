import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User, LayoutDashboard, FileText, Calendar, XCircle, UserCircle, HelpCircle, ShieldCheck, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useTheme } from '@/contexts/ThemeContext';


const logoUrl = "/logo.png";

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Intimações', icon: FileText, path: '/intimacoes' },
  { name: 'Agenda', icon: Calendar, path: '/agenda' },
  { name: 'Glossário', icon: Calendar, path: '/glossario' },
  { name: 'Orientações', icon: XCircle, path: '/orientacoes' },
  { name: 'Perfil', icon: UserCircle, path: '/perfil' },
  { name: 'Conexão', icon: MessageCircle, path: '/conexao' },
  { name: 'Suporte', icon: HelpCircle, path: '/suporte' },
];

export function Sidebar() {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();

  return (
    <aside className="w-64 flex-shrink-0 bg-card/60 border-r border-border flex flex-col p-4">
      <div className="flex items-center mb-8 px-3">
        <img 
          src={theme === 'dark' ? logoUrl : '/Logo_modo_claro.png'} 
          alt="IntimAI Logo" 
          style={theme === 'dark' 
            ? { width: '116.19px', height: '32px' } 
            : { height: '59px', width: 'auto' }}
        />
      </div>


      <nav className="flex-1 space-y-2">
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