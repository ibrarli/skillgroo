import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Header from "@/components/global/Header";
import Sidebar from "@/components/worker/Sidebar";
import OrderCard from "@/components/worker/orders/OrderCard";
import { ShoppingBag, Briefcase, PackageSearch } from "lucide-react";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  // Redirect if not logged in
  if (!session) redirect("/");

  // Fetch orders where the user is the BUYER
  const customerOrders = await prisma.order.findMany({
    where: { customerId: session.user.id },
    include: { 
      gig: true, 
      provider: { select: { name: true, username: true } } 
    },
    orderBy: { createdAt: "desc" }
  });

  // Fetch orders where the user is the SELLER (Provider)
  const providerOrders = await prisma.order.findMany({
    where: { providerId: session.user.id },
    include: { 
      gig: true, 
      customer: { select: { name: true, username: true } } 
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 ml-24 p-8 pt-24">
          <div className="max-w-6xl mx-auto space-y-12 pb-20">
            
            {/* Page Title */}
            <div>
              <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
                Your Orders
              </h1>
              <p className="text-neutral-500 font-medium mt-1">
                Track and manage your service requests and sales
              </p>
            </div>

            {/* SELLING SECTION (Provider View) */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b dark:border-neutral-800 pb-4">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                  <Briefcase size={22} />
                </div>
                <h2 className="text-xl font-black dark:text-white">Orders to Fulfil</h2>
                <span className="ml-auto bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                  {providerOrders.length} active
                </span>
              </div>

              {providerOrders.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {providerOrders.map((order) => (
                    <OrderCard key={order.id} order={order} type="selling" />
                  ))}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center bg-white dark:bg-neutral-900/50 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-[3rem] text-center">
                  <PackageSearch size={40} className="text-neutral-300 mb-4" />
                  <p className="text-neutral-400 font-bold uppercase text-xs tracking-widest">No sales yet</p>
                </div>
              )}
            </section>

         

          </div>
        </main>
      </div>
    </div>
  );
}