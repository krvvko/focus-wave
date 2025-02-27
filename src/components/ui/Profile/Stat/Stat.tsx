import React from 'react';
import styles from './index.module.css';

const Stat = ({icon: Icon, value, name, color}: {
    icon: React.ElementType,
    value: string | number,
    name: string,
    color: string,
}) => {
    return (
        <div className={styles.container}>
            <Icon size={24} color={color} />
            <div className={styles.data}>
                <span style={{color}} className={styles.value}>{value}</span>
                <span className={styles.name}>{name}</span>
            </div>
        </div>
    );
}

export default Stat;
