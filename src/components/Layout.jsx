import React from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export function Layout({ children }) {
  const { user, signOut } = useAuth();
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card/60 border-b border-border p-4 flex justify-between items-center">
          <div>
            {/* Espaço reservado à esquerda para futuros elementos */}
          </div>
          <div className="flex items-center space-x-4">
            {user && (
                <div className="flex items-center space-x-3">
                    <span className="text-sm font-semibold text-foreground truncate">{user.user_metadata.nome}</span>
                </div>
            )}
            <Button variant="ghost" onClick={signOut} className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-5 h-5 mr-2" />
              Sair
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </main>
        <footer className="text-center p-4 text-xs text-muted-foreground">
          powered by Aurios AI
        </footer>
      </div>
    </div>
  );
}