import React, { useEffect, useState } from 'react';
import ConfirmCard from "@/components/ConfirmCard";

const ZigZagCard = ({ zigZagId, zigId, zagId, allZigData, allZagData, connectedServices }) => {
    const [services, setServices] = useState([]);
    const [zig, setZig] = useState([]);
    const [zag, setZag] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const matchingZig = allZigData.find((zigData) => zigData.id === zigId);
        const matchingZag = allZagData.find((zagData) => zagData.id === zagId);

        if (matchingZig && matchingZag) {
            setZig(matchingZig);
            setZag(matchingZag);

            const matchingZigServices = connectedServices.filter((serviceData) => {
                return serviceData.id === matchingZig.service_id;
            });

            const matchingZagServices = connectedServices.filter((serviceData) => {
                return serviceData.id === matchingZag.service_id;
            });

            const matchingServices = [...matchingZigServices, ...matchingZagServices];

            if (matchingServices.length === 2) {
                setServices(matchingServices);
                setIsLoading(false);
            }
        }
    }, [allZigData, allZagData, connectedServices]);

    const content = () => {
        if (isLoading) {
            return <div>Loading...</div>;
        } else {
            return <ConfirmCard zigZagId={zigZagId} selectedServices={services} selectedZig={zig} selectedZag={zag} whichButton={"Delete"} />
        }
    }

    return content();
};

export default ZigZagCard;
