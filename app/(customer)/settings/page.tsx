import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Header from "@/components/global/Header";
import AccountSettings from "@/components/worker/settings/AccountSettings";
import NotificationSettings from "@/components/worker/settings/NotificationSettings";
import DangerZone from "@/components/worker/settings/DangerZone";
import { Settings as SettingsIcon, ShieldCheck, Bell, UserX, Palette } from "lucide-react";
import ThemeSettings from "@/components/worker/settings/ThemeSettings";

export default async function WorkerSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, notificationsEnabled: true }
  });

  return (
    /* Changed bg-neutral-50 dark:bg-neutral-950 to bg-background */
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      <Header />
      <div className="flex flex-1">
        {/* If you have a sidebar (indicated by ml-24), ensure its width matches */}
        <main className="flex-1 md:ml-24 p-8 pt-24">
          <div className="max-w-4xl mx-auto space-y-10 pb-20">
            
            {/* Page Header */}
            <div>
              {/* Changed text-neutral-900 dark:text-white to text-foreground */}
              <h1 className="text-4xl font-black text-foreground flex items-center gap-3">
                <SettingsIcon className="text-primary" size={32} />
                Settings
              </h1>
              <p className="text-neutral-500 font-medium mt-2">
                Manage your worker account preferences and security.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* 1. Account & Email */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <ShieldCheck size={18} className="text-neutral-400" />
                  <h2 className="text-sm font-black uppercase tracking-widest text-neutral-400">Account Security</h2>
                </div>
                <AccountSettings initialEmail={user?.email || ""} />
              </section>

              {/* NEW SECTION: Appearance/Theme */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <Palette size={18} className="text-neutral-400" />
                  <h2 className="text-sm font-black uppercase tracking-widest text-neutral-400">Appearance</h2>
                </div>
                <ThemeSettings />
              </section>

              {/* 2. Notifications */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <Bell size={18} className="text-neutral-400" />
                  <h2 className="text-sm font-black uppercase tracking-widest text-neutral-400">Preferences</h2>
                </div>
                <NotificationSettings initialEnabled={user?.notificationsEnabled || false} />
              </section>

              {/* 3. Danger Zone */}
              <section className="space-y-4 pt-10">
                <div className="flex items-center gap-2 px-2">
                  <UserX size={18} className="text-red-500" />
                  <h2 className="text-sm font-black uppercase tracking-widest text-red-500">Danger Zone</h2>
                </div>
                <DangerZone />
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}