import React, { ReactNode, useEffect, useRef } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

type FadeInListItemProps = {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
};

export default function FadeInListItem({ children, style }: FadeInListItemProps) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current; // start lower
    const scale = useRef(new Animated.Value(0.95)).current; // start smaller

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 400,
                delay: 100,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 400,
                delay: 100,
                useNativeDriver: true,
            }),
            Animated.spring(scale, {
                toValue: 1,
                friction: 6,
                tension: 80,
                delay: 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, [opacity, translateY, scale]);

    return (
        <Animated.View
            style={[
                {
                    opacity,
                    transform: [{ translateY }, { scale }],
                },
                style,
            ]}
        >
            {children}
        </Animated.View>
    );
}