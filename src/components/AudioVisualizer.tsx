export function AudioVisualizer({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex items-center justify-center space-x-2 h-10">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full bg-primary/70"
          style={{
            height: isActive ? `${10 + Math.random() * 25}px` : '4px',
            animation: isActive ? `wave 1.2s ease-in-out infinite alternate` : 'none',
            animationDelay: `${i * 0.15}s`,
            transition: 'height 0.3s ease',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes wave {
          from { transform: scaleY(0.2); }
          to { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
