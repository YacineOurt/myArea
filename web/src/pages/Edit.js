import React, {useEffect, useState} from 'react';
import Layout from "@/components/Layout";
import styles from "../../public/styles/edit.module.scss";
import {useForm} from "react-hook-form";
import {fetchDataOAuth, postNewEmail, postNewPassword, postNewUserInfo} from "@/auth/pocketbase";
import Cookies from "js-cookie";


function Edit() {
    const { register, handleSubmit } = useForm();
    const [userError, setUserError] = useState(false);
    const [userErrorMessage, setUserErrorMessage] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [OAuthList, setOAuthList] = useState([]);
    const [displayPassword, setDisplayPassword] = useState(true);

    const isLogged = !!Cookies.get('userId');

    useEffect(() => {

        if (!isLogged) {
            window.location.href = '/Login';
        }

        async function fetchData() {
            const data = await fetchDataOAuth();
            setOAuthList(data);
            if (data.length > 0) {
                if (data[0].recordId === Cookies.get('userId')) {
                    setDisplayPassword(false);
                }
            }
        }

        if (Cookies.get('isOAuth')) {
            fetchData();
        }
    }, []);

    const sendNewUser = async (data) => {
        try {
            const response = await postNewUserInfo(data);
            if (!response) {
                setUserError(true);
                setUserErrorMessage("Cannot be blank.");
            }
        } catch (e) {
            setUserError(true);
            setUserErrorMessage(e.data.data.username.message.toString());
        }
    }

    const sendNewEmail = (data) => {
        postNewEmail(data).then(r => {
            setEmailError(r);
        });
    }

    const sendNewPassword = async (data) => {
        if (data.newPassword !== data.confirmNewPassword) {
            setPasswordError(true);
            setPasswordErrorMessage("Passwords do not match.");
            return;
        }

        try {
            const response = await postNewPassword(data);
            if (!response) {
                setPasswordError(true);
                setPasswordErrorMessage("Cannot be blank.");
            }
        } catch (e) {
            if (e.data && e.data.data) {
                if (e.data.data.oldPassword && e.data.data.oldPassword.message) {
                    setPasswordError(true);
                    setPasswordErrorMessage(e.data.data.oldPassword.message);
                } else if (e.data.data.password && e.data.data.password.message) {
                    setPasswordError(true);
                    setPasswordErrorMessage(e.data.data.password.message);
                } else if (e.data.data.passwordConfirm && e.data.data.passwordConfirm.message) {
                    setPasswordError(true);
                    setPasswordErrorMessage(e.data.message);
                } else {
                    setPasswordError(true);
                    setPasswordErrorMessage("An error occurred.");
                }
            } else {
                setPasswordError(true);
                setPasswordErrorMessage("An error occurred.");
            }
        }
    }


    return (
        <Layout>
            <div className={styles.contentContainer}>
                <div className={styles.option}>
                    <div className={styles.box}>
                        <h2>Modifier le Profil</h2>
                        <form onSubmit={handleSubmit(sendNewUser)}>
                            <div className={styles['user-box']}>
                                <input
                                    type="file"
                                    name=""
                                    required=""
                                    accept="image/*"
                                    {...register("avatar")}
                                />
                                <label>Avatar</label>
                            </div>
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
                                    {...register("name")}
                                />
                                <label>Name</label>
                            </div>
                            {userError && (
                                <p className={styles.errorText}>{userErrorMessage}</p>
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
                {/*                <div className={styles.option}>
                    <div className={styles.box}>
                        <h2>Modifier l'Email</h2>
                        <form onSubmit={handleSubmit(sendNewEmail)}>
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
                                    type="text"
                                    name=""
                                    required=""
                                    {...register("newEmail")}
                                />
                                <label>New Email</label>
                            </div>
                            <div className={styles['user-box']}>
                                <input
                                    type="password"
                                    name=""
                                    required=""
                                    {...register("emailPassword")}
                                />
                                <label>Password</label>
                            </div>
                            {emailError && (
                                <p className={styles.errorText}>Erreur lors du changement des données. Veuillez réessayer.</p>
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
                </div>*/}
                {displayPassword && (
                    <div className={styles.option}>
                        <div className={styles.box}>
                            <h2>Modifier le Mot de passe</h2>
                            <form onSubmit={handleSubmit(sendNewPassword)}>
                                <div className={styles['user-box']}>
                                    <input
                                        type="password"
                                        name=""
                                        required=""
                                        {...register("password")}
                                    />
                                    <label>Password</label>
                                </div>
                                <div className={styles['user-box']}>
                                    <input
                                        type="password"
                                        name=""
                                        required=""
                                        {...register("newPassword")}
                                    />
                                    <label>New Password</label>
                                </div>
                                <div className={styles['user-box']}>
                                    <input
                                        type="password"
                                        name=""
                                        required=""
                                        {...register("confirmNewPassword")}
                                    />
                                    <label>Confirm New Password</label>
                                </div>
                                {passwordError && (
                                    <p className={styles.errorText}>{passwordErrorMessage}</p>
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
                )}
            </div>
        </Layout>
    );
}

export default Edit;
