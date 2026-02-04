import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <div>Access denied</div>
  }

  return <div>Private Dashboard</div>
}