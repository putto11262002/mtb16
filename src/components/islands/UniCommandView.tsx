import * as React from 'react';
import type { Commander } from '@/lib/uni-command-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UniCommandViewProps {
  initialCommander: Commander;
}

export default function UniCommandView({ initialCommander }: UniCommandViewProps) {
  const [history, setHistory] = React.useState<Commander[]>([]);
  const [currentCommander, setCurrentCommander] = React.useState<Commander>(initialCommander);

  const handleSelectCommander = (commander: Commander) => {
    setHistory([...history, currentCommander]);
    setCurrentCommander(commander);
  };

  const handleGoBack = (index: number) => {
    if (index === 0) {
      setCurrentCommander(initialCommander);
      setHistory([]);
      return;
    }
    const newHistory = history.slice(0, index - 1);
    const newCurrent = history[index - 1];
    setHistory(newHistory);
    setCurrentCommander(newCurrent);
  };

  const CommanderCard = ({ commander, isMain }: { commander: Commander; isMain?: boolean }) => (
    <Card
      className={`bg-background rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border overflow-hidden ${
        isMain ? 'max-w-2xl' : 'cursor-pointer'
      }`}
      onClick={() => !isMain && handleSelectCommander(commander)}
    >
      <div className={isMain ? 'md:flex' : ''}>
        <div
          className={`relative ${
            isMain ? 'md:w-1/3' : 'w-full'
          } aspect-[2/3] bg-muted flex items-center justify-center`}
        >
          <img src={commander.image} alt={commander.name} className="object-cover w-full h-full" />
        </div>
        <div className={`p-6 ${isMain ? 'md:w-2/3' : ''}`}>
          <CardHeader className="p-0 mb-2">
            <CardTitle className={isMain ? 'text-2xl' : 'text-xl'}>{commander.name}</CardTitle>
            <p className={`text-primary ${isMain ? 'text-lg' : 'text-md'}`}>{commander.title}</p>
          </CardHeader>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-8 text-lg flex items-center flex-wrap">
        <ol className="flex items-center space-x-2">
          <li>
            <button
              onClick={() => {
                setCurrentCommander(initialCommander);
                setHistory([]);
              }}
              className="hover:underline"
            >
              {initialCommander.title}
            </button>
          </li>
          {history.map((c, i) => (
            <li key={c.id} className="flex items-center space-x-2">
              <span className="text-muted-foreground">/</span>
              <button onClick={() => handleGoBack(i + 1)} className="hover:underline">
                {c.title}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {/* Current Commander */}
      <div className="flex flex-col items-center mb-16">
        <h2 className="text-4xl font-bold mb-4 text-center">{currentCommander.title}</h2>
        <CommanderCard commander={currentCommander} isMain />
      </div>

      {/* Subordinates */}
      {currentCommander.subordinates && currentCommander.subordinates.length > 0 && (
        <div>
          <h3 className="text-3xl font-bold mb-8 text-center">สายการบังคับบัญชา</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentCommander.subordinates.map((sub) => (
              <CommanderCard key={sub.id} commander={sub} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
