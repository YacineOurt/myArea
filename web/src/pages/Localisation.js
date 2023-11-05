import React, {useEffect, useState} from 'react';
import Layout from "@/components/Layout";
import localisation from "../../public/styles/localisation.module.scss";
import styles from "../../public/styles/login.module.scss";
import {useForm} from "react-hook-form";
import {postLocalisation} from "@/auth/pocketbase";
import Cookies from "js-cookie";

const Localisation = () => {
    const { register, handleSubmit } = useForm();

    const isLogged = !!Cookies.get('userId');

    const sendData = (data) => {
        const concatenatedData = `${data.adresse}, ${data.codePostal}, ${data.ville}`;
        postLocalisation(concatenatedData);
    }

    useEffect(() => {
        if (!isLogged) {
            window.location.href = '/Login';
        }
    }, []);

    return (
        <Layout>
            <div className={localisation.contentContainer}>
                <div className={styles.loginOption}>
                    <div className={styles.loginBox}>
                        <h2>Localisation</h2>
                        <form onSubmit={handleSubmit(sendData)}>
                            <div className={styles['user-box']}>
                                <input
                                    type="text"
                                    name=""
                                    required=""
                                    {...register("adresse")}
                                />
                                <label>Adresse</label>
                            </div>
                            <div className={styles['user-box']}>
                                <input
                                    type="text"
                                    name=""
                                    required=""
                                    {...register("codePostal")}
                                />
                                <label>Code Postal</label>
                            </div>
                            <div className={styles['user-box']}>
                                <input
                                    type="text"
                                    name=""
                                    required=""
                                    {...register("ville")}
                                />
                                <label>Ville</label>
                            </div>
                            <button type="submit" className={styles.submitButton}>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Localisation;
