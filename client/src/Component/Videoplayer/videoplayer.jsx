import React, { useRef, useEffect } from 'react';
import './videoplayer.css';

const VideoPlayer = ({ src, onShowComments, onNextVideo }) => {
    const videoRef = useRef(null);
    let isHolding = false;
    let clickCount = 0;
    let clickTimer = null;

    const handleSingleClick = (e) => {
        const { clientX, clientY } = e.touches ? e.touches[0] : e;
        const { width, top } = e.target.getBoundingClientRect();
        const isTopRight = clientX > width - 50 && clientY < top + 50;
        if (isTopRight) {
            getLocation();
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
            <video
                ref={videoRef}
                src={src}
                className="video-element"
                controls
                autoPlay
            ></video>
        </div>
    );
};

export default VideoPlayer;

