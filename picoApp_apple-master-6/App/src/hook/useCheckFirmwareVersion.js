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
            const version = res.substring(2,4)+ "."+ res.substring(4,6) + "." + res.substring(6,8)
            console.log({version});
            return version
        } catch (err) {
            console.log('getLatestFirmware err', err);
        }
    }

    const getDeviceFirmwareVersion = async (id) => {
        await getDeviceState(userInfo.userid, userInfo.apiKey)
        return device[id].FirmwareVersion
    }

    const compareVersion = (verA, verB) => {
        let result = false;
        verA = verA.split('.'); // .을 기준으로 문자열 배열로 만든다 [6][8]
        verB = verB.split('.'); // .을 기준으로 문자열 배열로 만든다 [6][7][99]
        
        const length = Math.max(verA.length, verB.length); // 배열이 긴쪽의 length를 구함
        
        for (let i = 0; i < length; i++) {
            let a = verA[i] ? parseInt(verA[i], 10) : 0; // 10진수의 int로 변환할 값이 없을 때 0으로 값을 넣습니다.
            let b = verB[i] ? parseInt(verB[i], 10) : 0;
            if (a > b) {
                result = true;
                break;
            }
        }
        console.log({verA, verB}, "verA 가 verB 보다 큰가? " + result);
        return result;
    }

    return [
        getLatestFirmwareVersion,
        getDeviceFirmwareVersion,
        compareVersion,
    ]
}

export default useCheckFirmwareVersion