"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import styles from "./index.module.css";

const Header = () => {
    const { data: session } = useSession();

    return (
        <div className={styles.container}>
            <nav>
                {session ? (
                    <>
                        <Link href="/app" className={styles.link}>App</Link>
                        <Link href="/goals" className={styles.link}>Goals</Link>
                        <button onClick={() => signOut()} className={styles.button}>Logout</button>
                    </>
                ) : (
                    <Link href="/login" className={styles.link}>Login</Link>
                )}
            </nav>
        </div>
    );
};

export default Header;
