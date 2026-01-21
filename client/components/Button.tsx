export default function Button({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`bg-black text-white px-4 py-2 rounded disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
