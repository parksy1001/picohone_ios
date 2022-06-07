import React, {useEffect, useState} from "react";

const useTimer = () => {
    const [seconds, setSeconds] = useState(-1);
    const [isClear, setIsClear] = useState(false)

    useEffect(() => {
        const countdown = setInterval(() => {
            if (parseInt(seconds) > 0)
                setSeconds(parseInt(seconds) - 1)
            if (parseInt(seconds) === 0) {
                clearInterval(countdown)
                setIsClear(true)
            }
        }, 1000);
        return () => clearInterval(countdown)
    }, [seconds])

    const startTimer = s => {
        setSeconds(s - 1)
        setIsClear(false)
    }

    const stopTimer = () => {
        setSeconds(-1)
    }

    return [
        seconds,
        isClear,
        startTimer,
        stopTimer,
    ]
}

export default useTimer
