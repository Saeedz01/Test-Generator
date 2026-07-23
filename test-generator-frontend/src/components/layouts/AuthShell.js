/**
 * Auth page chrome — centered column for login / register / OTP.
 * @param {{ children: import("react").ReactNode }} props
 */
export default function AuthShell({ children }) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
