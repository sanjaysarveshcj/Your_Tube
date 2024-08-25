import React, { useRef, useEffect, useState } from 'react';
import './videoplayer.css';
import { FaVolumeUp, FaPlay, FaPause,FaVolumeMute, FaExpand, FaTachometerAlt } from 'react-icons/fa';

const VideoPlayer = ({ src, onShowComments, onNextVideo }) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    let isHolding = false;
    let clickCount = 0;
    let clickTimer = null;
    const [isPlaying, setIsPlaying] = useState(true);
    const [volume, setVolume] = useState(1);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState('00:00');
    const [currentTime, setCurrentTime] = useState('00:00');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [speedMenuVisible, setSpeedMenuVisible] = useState(false);
    const [isMuted, setIsMuted] = useState(false);




    useEffect(() => {
        const videoElement = videoRef.current;

        const handleLoadedMetadata = () => {
            setDuration(formatTime(videoElement.duration));
        };

        const handleTimeUpdate = () => {
            setCurrentTime(formatTime(videoElement.currentTime));
        };

        videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
            videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, []);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };


    const togglePlayPause = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const toggleMute = () => {
        if (isMuted) {
            videoRef.current.volume = 1;
        } else {
            videoRef.current.volume = 0;
        }
        setIsMuted(!isMuted);
    };

    const toggleFullScreen = () => {
        if (!isFullscreen) {
            containerRef.current.classList.add('fullscreen');
            videoRef.current.classList.add('fullscreen');
            containerRef.current.requestFullscreen();
        } else {
            containerRef.current.classList.remove('fullscreen');
            videoRef.current.classList.remove('fullscreen');
            document.exitFullscreen();
        }
        setIsFullscreen(!isFullscreen);
    };

    const toggleSpeedMenu = () => {
        setSpeedMenuVisible(!speedMenuVisible);
    };

    const changePlaybackSpeed = (speed) => {
        videoRef.current.playbackRate = speed;
        setSpeedMenuVisible(false);
    };

    const handleVolumeChange = (e) => {
        const volumeValue = e.target.value;
        videoRef.current.volume = volumeValue;
        setVolume(volumeValue);
    };

    const handleProgressChange = (e) => {
        const progressValue = e.target.value;
        videoRef.current.currentTime = (videoRef.current.duration * progressValue) / 100;
        setProgress(progressValue);
    };

    const updateProgress = () => {
        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration;
        setProgress((currentTime / duration) * 100);
    };

    useEffect(() => {
        const videoElement = videoRef.current;
        videoElement.addEventListener('timeupdate', updateProgress);

        return () => {
            videoElement.removeEventListener('timeupdate', updateProgress);
        };
    }, []);

    const handleSingleClick = (e) => {
        const { clientX, clientY } = e.touches ? e.touches[0] : e;
        const { width, top } = e.target.getBoundingClientRect();
        const isTopRight = clientX > width - 50 && clientY < top + 50;
        if (isTopRight) {
            getLocation();
        }
        else{
            togglePlayPause();
        }
    };

    const handleDoubleClick = (e) => {
        e.preventDefault();
        const { clientX } = e.touches ? e.touches[0] : e;
        const { width } = e.target.getBoundingClientRect();
        const side = clientX < width / 2 ? 'left' : 'right';
        if (videoRef.current) {
            const currentTime = videoRef.current.currentTime;
            const newTime = side === 'right' ? currentTime + 10 : currentTime - 10;
            videoRef.current.currentTime = newTime;
        }
    };

    function close_website() {
        const pages = window.history.length - 1;
        window.history.go(-pages);
    }

    const handleTripleClick = (e) => {
        const { clientX } = e.touches ? e.touches[0] : e;
        const { width } = e.target.getBoundingClientRect();

        let clickSide;
        if (clientX < width / 3) {
            clickSide = 'left';
        } else if (clientX > 2 * width / 3) {
            clickSide = 'right';
        } else {
            clickSide = 'middle';
        }

        if (clickSide === 'right') {
            close_website();
        } else if (clickSide === 'left') {
            if (onShowComments) {
                onShowComments();
            }
        } else if (clickSide === 'middle') {
            if (onNextVideo) {
                onNextVideo();
            }
        }
    };

    const handleClick = (e) => {
        clickCount++;

        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                if (clickCount === 1) {
                    handleSingleClick(e);
                }
                clickCount = 0;
            }, 300);
        } else if (clickCount === 2) {
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => {
                if (clickCount === 2) {
                    handleDoubleClick(e);
                }
                clickCount = 0;
            }, 300);
        } else if (clickCount === 3) {
            clearTimeout(clickTimer);
            handleTripleClick(e);
            clickCount = 0;
        }
    };

    useEffect(() => {
        const videoElement = videoRef.current;
        videoElement.addEventListener('click', handleClick);
        videoElement.addEventListener('touchstart', handleClick);
        videoElement.addEventListener('mousedown', handleHold);
        videoElement.addEventListener('touchstart', handleHold);
    
        return () => {
            if (videoElement) {
                videoElement.removeEventListener('click', handleClick);
                videoElement.removeEventListener('touchstart', handleClick);
                videoElement.removeEventListener('mousedown', handleHold);
                videoElement.removeEventListener('touchstart', handleHold);
            }
        };
    }, []);
    

    const handleHold = (e) => {
        isHolding = true;
        const startTime = new Date().getTime();
        const touch = e.touches ? e.touches[0] : e;
    
        const checkHold = () => {
            if (isHolding && new Date().getTime() - startTime > 500) {
                const { clientX } = touch;
                const { width } = touch.target.getBoundingClientRect();
                const side = clientX < width / 2 ? 'left' : 'right';
                try {
                    if (videoRef.current) {
                        videoRef.current.playbackRate = side === 'right' ? 2 : 0.5;
                    } else {
                        throw new Error("Video element not found");
                    }
                } catch (error) {
                    console.error("Failed to set playback rate:", error.message);
                }
            }
        };
    
        const handleHoldUp = () => {
            isHolding = false;
            try {
                if (videoRef.current) {
                    videoRef.current.playbackRate = 1;
                } else {
                    throw new Error("Video element not found during hold release");
                }
            } catch (error) {
                console.error("Failed to reset playback rate:", error.message);
            }
            document.removeEventListener('mouseup', handleHoldUp);
            document.removeEventListener('touchend', handleHoldUp);
        };
    
        document.addEventListener('mouseup', handleHoldUp);
        document.addEventListener('touchend', handleHoldUp);
    
        setTimeout(checkHold, 500);
    };
    
    

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    function showPosition(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        getWeather(latitude, longitude);
    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
    }

    function getWeather(lat, lon) {
        const apiKey = '13a37beb41cc6f772cd8c024661ef087';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const temperature = data.main.temp;
                const locationName = data.name;
                alert(`Location: ${locationName}\nTemperature: ${temperature}°C`);
            })
            .catch(error => {
                console.error("Error fetching the weather data: ", error);
            });
    }

    return (
        <div className="video-player">
            <div className="video-container" ref={containerRef}>
                <video ref={videoRef} src={src} className="video-element" autoPlay></video>
                <div className="controls">
                    <button className="play-pause" onClick={togglePlayPause}>
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <input
                        type="range"
                        className="progress-bar"
                        min="0"
                        max={videoRef.current?.duration || 0}
                        step='0.001'
                        value={videoRef.current?.currentTime || 0}
                        onChange={(e) => (videoRef.current.currentTime = e.target.value)}
                    />
                    <div className="time-display">
                        {currentTime} / {duration}
                    </div>
                    <div className="volume-control" onClick={toggleMute}>
                            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                        </div>
                        <input
                            type="range"
                            className="volume-bar"
                            min="0"
                            max="1"
                            step="0.01"
                            value={videoRef.current ? videoRef.current.volume : 1}
                            onChange={handleVolumeChange}
                        />
                    <button className="speed-control" onClick={toggleSpeedMenu}>
                        <FaTachometerAlt />
                    </button>
                    {speedMenuVisible && (
                        <div className="speed-control-menu show">
                            <button onClick={() => changePlaybackSpeed(0.5)}>0.5x</button>
                            <button onClick={() => changePlaybackSpeed(1)}>1x</button>
                            <button onClick={() => changePlaybackSpeed(1.5)}>1.5x</button>
                            <button onClick={() => changePlaybackSpeed(2)}>2x</button>
                        </div>
                    )}
                    <button className="fullscreen" onClick={toggleFullScreen}>
                        <FaExpand />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;