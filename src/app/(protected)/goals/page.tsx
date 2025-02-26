import { getServerSession } from "next-auth";
import {prisma} from "@/lib/prisma";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import dynamic from "next/dynamic";

const GoalsForm = dynamic(() => import("@/components/ui/GoalsForm/GoalsForm"));

export default async function GoalsPage() {
    const session = await getServerSession(authOptions);

    const userData = await prisma.user.findUnique({
        where: { email: session!.user!.email! },
        include: {
            focus_on: {
                select: {
                    id: true,
                    field: true,
                    operator: true,
                    time: true,
                }
            }
        }
    });

    return (
        <GoalsForm initialGoals={userData?.focus_on || []} />
    );
}
