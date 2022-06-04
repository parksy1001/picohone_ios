import React, { useContext, useState, useEffect } from 'react';
import { DeviceContext, LanguageContext, PicoContext, SettingContext, UserContext } from '../../context';

const useCheckFirmwareVersion = () => {
    const { getDeviceState } = useContext(SettingContext);
    const userInfo = useContext(UserContext);
    const device = useContext(DeviceContext);

    const getLatestFirmwareVersion = async (id) => {
        try {
            const response = await fetch('https://us-central1-pico-home.cloudfunctions.net/GetLatestFirmware', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    serialNum: device[id].SerialNum,
                }),
            });
            const res = await response.text()
            const version = parseFloat(res.substring(2,4)+"."+res.substring(4,6)+"."+res.substring(6,8))
            
            return version
        } catch (err) {
            console.log('getLatestFirmware err', err);
        }
    }

    const getDeviceFirmwareVersion = async (id) => {
        await getDeviceState(userInfo.userid, userInfo.apiKey)
        return parseFloat(device[id].FirmwareVersion) 
    }

    return [
        getLatestFirmwareVersion,
        getDeviceFirmwareVersion,
    ]
}

export default useCheckFirmwareVersion