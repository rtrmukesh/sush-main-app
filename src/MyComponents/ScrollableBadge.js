import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const Badge = ({ skill }) => {
    return (
        <TouchableOpacity style={styles.badge}>
            <Text style={styles.badgeText}>{skill}</Text>
        </TouchableOpacity>
    );
};

const ScrollableBadge = ({ title, badgeArray=[] }) => {
    const scrollViewRef = useRef(null);
    const [isManualScrolling, setIsManualScrolling] = useState(false);
    const badgeWidth = 100; 
    const totalBadges = badgeArray.length;

    useEffect(() => {
        let intervalId;
        let scrollPosition = 0; 

        const scrollToRight = () => {
            if (scrollViewRef.current) {
                scrollPosition += 1;

                scrollViewRef.current.scrollTo({
                    x: scrollPosition,
                    animated: true,
                });

                if (scrollPosition >= totalBadges * badgeWidth) {
                    scrollPosition = 0; 

                    scrollViewRef.current.scrollTo({ x: scrollPosition, animated: false });
                }
            }
        };

        if (!isManualScrolling) {
            intervalId = setInterval(scrollToRight, 30);
        }

        return () => clearInterval(intervalId);
    }, [isManualScrolling, totalBadges, badgeWidth]);

    const handleScrollBegin = () => {
        setIsManualScrolling(true);
    };

    const handleScrollEnd = () => {
        setIsManualScrolling(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                ref={scrollViewRef}
                onScrollBeginDrag={handleScrollBegin}
                onScrollEndDrag={handleScrollEnd}
                style={styles.scrollView}
                scrollEventThrottle={16} 
            >
                {badgeArray.map((skill, index) => (
                    <Badge key={index} skill={skill} />
                ))}

                {badgeArray.map((skill, index) => (
                    <Badge key={index + totalBadges} skill={skill} />
                ))}
            </ScrollView>
        </View>
    );
};
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        padding: 10,
    },
    title: {
        fontSize: width > 600 ? 24 : 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    scrollView: {
        flexDirection: 'row',
    },
    badge: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
        marginRight: 10,
    },
    badgeText: {
        color: 'black',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default ScrollableBadge;
