import styles from './App.module.scss';
import classNames from 'classnames/bind';

import images from './assest/images';
import sounds from './assest/sounds';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { TimePicker, Switch } from 'antd';
import { useEffect, useRef, useState } from 'react';

dayjs.extend(customParseFormat);

const cx = classNames.bind(styles);

function App() {
    const [hour, setHour] = useState(Number);
    const [minutes, setMinutes] = useState(Number);
    const [second, setSecond] = useState(Number);
    const [disable, setDisable] = useState(false);
    const [value, setValue] = useState('');
    const [theme, setTheme] = useState('light');

    const audioRef = useRef();

    const onChangeTime = (time) => {
        setValue(time);
        setHour(time.$H);
        setMinutes(time.$m);
        setSecond(time.$s);
    };

    const timeId = useRef();
    useEffect(() => {
        if (second < 0) {
            setSecond(59);
            setMinutes((prev) => prev - 1);
        }
        if (minutes < 0) {
            setMinutes(59);
            setHour((prev) => prev - 1);
        }
        if (hour < 0) {
            setHour(0);
            setMinutes(0);
            setSecond(0);
            audioRef.current.play();
            clearInterval(timeId.current);
        }
    }, [hour, minutes, second]);

    const handleStart = () => {
        if (value !== '') {
            timeId.current = setInterval(() => {
                setSecond((prev) => prev - 1);
            }, 1000);
        }
        setDisable(true);
    };

    const handleStop = () => {
        audioRef.current.pause();
        clearInterval(timeId.current);
        setDisable(false);
    };

    const handleReset = () => {
        setHour(0);
        setMinutes(0);
        setSecond(0);
        setValue('');
        setDisable(false);
        audioRef.current.pause();
        clearInterval(timeId.current);
    };

    const handleSwitch = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className={cx(`${theme}`)}>
            <header className={cx('wrapper')}>
                <div className={cx('inner')}>
                    <div className={cx('logo-title')}>
                        <img className={cx('logo')} src={images.logo} alt="contdow" />
                        <h1 className={cx('title')}>Count Down Time</h1>
                    </div>
                    <div className={cx('control')}>
                        <TimePicker
                            value={value}
                            onChange={onChangeTime}
                            defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}
                        />
                        <button className={cx('control-btn')} onClick={handleStart} disabled={disable}>
                            Start
                        </button>
                        <button className={cx('control-btn')} onClick={handleStop}>
                            Stop
                        </button>
                        <button className={cx('control-btn')} onClick={handleReset}>
                            Reset
                        </button>
                    </div>
                </div>
            </header>
            <div className={cx('content')}>
                <h1 className={cx('content-item')}>{hour < 10 ? `0${hour}` : hour}</h1>
                <span>:</span>
                <h1 className={cx('content-item')}>{minutes < 10 ? `0${minutes}` : minutes}</h1>
                <span>:</span>
                <h1 className={cx('content-item')}>{second < 10 ? `0${second}` : second}</h1>
            </div>
            <audio className="audio-control" ref={audioRef} src={sounds.sound} allow="autoplay" loop></audio>
            <div className={cx('switch-theme')}>
                <label className={cx('title-theme')}>Dark Theme</label>
                <Switch defaultChecked onClick={handleSwitch} />
                <label className={cx('title-theme')}>Light Theme</label>
            </div>
        </div>
    );
}

export default App;
