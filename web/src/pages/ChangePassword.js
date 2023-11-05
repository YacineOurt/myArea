import React, {useState} from 'react';
import styles from "../../public/styles/edit.module.scss";
import {useForm} from "react-hook-form";
import {postChangerDefaultPassword} from "@/auth/pocketbase";

const ChangePassword = ( ) => {

    const { register, handleSubmit } = useForm();
    const [passwordError, setPasswordError] = useState(false);

    const sendNewPassword = (data) => {
        postChangerDefaultPassword(data).then(r => {
            setPasswordError(r);
        });
    }

    return (
        <div className={styles.contentContainer} style={{marginTop: '8%'}}>
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
                                {...register("confirmPassword")}
                            />
                            <label>Confirm Password</label>
                        </div>
                        {passwordError && (
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
            </div>
        </div>
    );

};

export default ChangePassword;