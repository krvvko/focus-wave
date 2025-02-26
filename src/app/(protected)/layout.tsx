import React from 'react';
import styles from './index.module.css';

const layout = ({children}: Readonly<{ children: React.ReactNode }>) => {
    return (
        <main className={styles.container}>
            {children}
        </main>
    );
}

export default layout;