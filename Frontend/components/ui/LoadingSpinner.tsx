type Props = {
  text?: string;
};

export function LoadingSpinner({ text = "불러오는 중..." }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div
        className="w-6 h-6 rounded-full animate-spin"
        style={{ border: '2px solid rgba(158,167,230,0.35)', borderTop: '2px solid var(--brand)' }}
      />
      <p className="text-sm text-neutral-500">{text}</p>
    </div>
  );
}