import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function AppShell({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1440px] gap-6 px-4 py-4 lg:px-6">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <Topbar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
