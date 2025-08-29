import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function OrientacoesPage() {
  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardContent className="p-4">
          <h2 className="text-2xl font-bold active-link-gradient italic">Orientações</h2>
          <p className="text-gray-600 text-sm">Siga as orientações para o uso correto do sistema.</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          {/* O conteúdo de orientações virá aqui */}
          <p>Em construção...</p>
        </CardContent>
      </Card>
    </div>
  );
}