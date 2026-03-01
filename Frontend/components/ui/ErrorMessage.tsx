type Props = {
  message: string;
  onRetry?: () => void;
};

export function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className="border border-red-200 bg-red-50 rounded-xl p-5 text-center">
      <p className="text-sm text-red-600 mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-red-600 underline underline-offset-2 hover:text-red-800 transition-colors"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}