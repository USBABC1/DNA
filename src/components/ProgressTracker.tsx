export function ProgressTracker({ current, total }: { current: number; total: number }) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Pergunta {Math.min(current, total)} de {total}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
