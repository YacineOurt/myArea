import React, { useState } from 'react';
import styles from "../../public/styles/login.module.scss";
import Link from "next/link";
import Layout from "@/components/Layout";
import { useForm } from "react-hook-form";
import {login, getToken, registerWithGoogle} from "@/auth/pocketbase";

function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [errorTitleMessage, setErrorTitleMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { register, handleSubmit } = useForm();

    async function signin(data) {
        setIsLoading(true);

        try {
            await login(data.email, data.password);
            setIsLoading(false);
            setLoginError(false);
        } catch (error) {
            if (error.data && error.data.data) {
                if (error.data.data.identity && error.data.data.identity.message) {
                    setErrorMessage(error.data.data.identity.message);
                } else if (error.data.data.password && error.data.data.password.message) {
                    setErrorMessage(error.data.data.password.message);
                }
            }

            setErrorTitleMessage(error.data.message)

            if (errorTitleMessage === "Failed to authenticate.") {
                setErrorMessage("Email ou mot de passe incorrect");
            }

            setIsLoading(false);
            setLoginError(true);
        }
    }

    async function handleGoogleConnection() {
        try {
            await registerWithGoogle();
        } catch (error) {
            console.log('error: ', error);
            console.log('errorData: ', error.data);
        }
    }

    return (
        <Layout>
            <div className={styles.contentContainer}>
                <div className={styles.description}>
                    Log in
                </div>
                <div className={styles.content}>
                    <div className={styles.loginOption}>
                        <button className={styles.googleButton} onClick={() => handleGoogleConnection()}>
                            <img src="../assets/google.png" alt="Logo Google" className={styles.logo} />
                            Continuer avec Google
                        </button>
                    </div>
                    <hr className={styles.separator} />
                    <div className={styles.loginOption}>
                        <div className={styles.loginBox}>
                            <h2>Log In</h2>
                            <form onSubmit={handleSubmit(signin)}>
                                <div className={styles['user-box']}>
                                    <input
                                        type="text"
                                        name=""
                                        required=""
                                        {...register("email")}
                                    />
                                    <label>Username / Email</label>
                                </div>
                                <div className={styles['user-box']}>
                                    <input
                                        type="password"
                                        name=""
                                        required=""
                                        {...register("password")}
                                    />
                                    <label>Password</label>
                                </div>
                                {loginError && (
                                    <div>
                                        <p className={styles.errorText}>{errorTitleMessage}</p>
                                        <p className={styles.errorText} style={{marginBottom: '15px'}}>{errorMessage}</p>
                                    </div>
                                )}
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
                <div className={styles.registerText}>
                    Vous n'avez pas de compte ? <Link href={"/Register"} className={styles.registerLink}>S'inscrire</Link>
                </div>
            </div>
        </Layout>
    );
}

export default Login;
