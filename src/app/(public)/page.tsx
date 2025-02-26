import styles from "./page.module.css";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
    const session = await getServerSession(authOptions)

    return (
        <div className={styles.page}>
            {JSON.stringify(session, null, 2)}
        </div>
    );
}
