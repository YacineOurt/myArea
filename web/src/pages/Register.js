import React, { useState } from 'react';
import Layout from "@/components/Layout";
import styles from "../../public/styles/login.module.scss";
import {registerUser, registerWithGoogle} from "@/auth/pocketbase";
import { useForm } from 'react-hook-form';

function Login() {

    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [errorTitleMessage, setErrorTitleMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { register, handleSubmit } = useForm();

    async function signup(data) {
        setIsLoading(true);
        let errorMessage = "";

        try {
            await registerUser(data.username, data.email, data.password);
            setIsLoading(false);
            setLoginError(false);
        } catch (error) {
            if (error.data && error.data.data) {
                if (error.data.data.email && error.data.data.email.message) {
                    errorMessage = error.data.data.email.message;
                } else if (error.data.data.username && error.data.data.username.message) {
                    errorMessage = error.data.data.username.message;
                } else if (error.data.data.password && error.data.data.password.message) {
                    errorMessage = error.data.data.password.message;
                }
            }

            setErrorTitleMessage(error.data.message)

            setIsLoading(false);
            setLoginError(true);
            setErrorMessage(errorMessage);
        }
    }

    return (
        <Layout>
            <div className={styles.contentContainer}>
                <div className={styles.description}>
                    Create an account
                </div>
                <div className={styles.content}>
                    <div className={styles.loginOption}>
                        <div className={styles.loginBox}>
                            <h2>Register</h2>
                            <form onSubmit={handleSubmit(signup)}>
                                <div className={styles['user-box']}>
                                    <input
                                        type="text"
                                        name=""
                                        required=""
                                        {...register("username")}
                                    />
                                    <label>Username</label>
                                </div>
                                <div className={styles['user-box']}>
                                    <input
                                        type="text"
                                        name=""
                                        required=""
                                        {...register("email")}
                                    />
                                    <label>Email</label>
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
            </div>
        </Layout>
    );
}

export default Login;
