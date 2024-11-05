import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';

const BgGradientColor = ({ children, numOfColors=3 }) => {
    const [colors, setColors] = useState([]);

    useEffect(() => {
        generateRandomGradient();
    }, []);

    function generateRandomColor() {
        return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    }

    function generateRandomGradient() {
        const randomColors = Array.from({ length: numOfColors }, () => generateRandomColor());
        setColors(randomColors);
    }

    return (
        <LinearGradient
            colors={colors}
            style={{ height: "100%" }}
        >
            {children}
        </LinearGradient>
    );
};

export default BgGradientColor;
