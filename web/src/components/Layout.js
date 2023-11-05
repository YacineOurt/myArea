import '../app/globals.css'
import React from "react";
import Header from "@/layouts/Header";
import Footer from "@/layouts/Footer";
import styles from "../../public/styles/layout.module.scss";

export default function Layout({ children }) {
    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                {children}
            </div>
            <Footer />
        </div>
    );
}


