import React, {useEffect, useState} from 'react';
import Layout from "@/components/Layout";
import styles from "../../public/styles/dashboard.module.scss";
import 'font-awesome/css/font-awesome.min.css';
import Creation from "@/components/Creation";
import Cookies from "js-cookie";

function Dashboard() {

    const [searchTerm, setSearchTerm] = useState('');
    const labelArray = [
        'Select a service',
        'Choose a Zig',
        'Specify another service',
        'Define an Zag',
        'Confirm and submit'
    ];
    const [currentStep, updateCurrentStep] = useState(1);

    const isLogged = !!Cookies.get('userId');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    function updateStep(step) {
        updateCurrentStep(step);
    }

    useEffect(() => {
            if (!isLogged) {
                window.location.href = '/Login';
            }
    }, []);

    return (
        <Layout>
            <div className={styles.dashboardContainer}>
                <h1 className={styles.dashboardHeading}>Dashboard</h1>
                <p>Welcome to your dashboard</p>
            </div>
            <Creation searchTerm={searchTerm} labelArray={labelArray} currentStep={currentStep} updateStep={updateStep} handleSearchChange={handleSearchChange}/>
        </Layout>
    );
}

export default Dashboard;
