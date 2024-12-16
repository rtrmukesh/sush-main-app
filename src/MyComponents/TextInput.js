import { Field, useFormikContext } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, View } from 'react-native';
import { Color } from '../helper/Color';

const CustomTextInput = (props) => {
    let {
        name,
        label,
        placeholder,
        required,
        editable = true,
        multiline,
        keyboardType,
        onInputChange,
        placeHolderShow,
        secureTextEntry,
        maxLength,
        title,
    } = props;
    const { touched, errors, values: formikValues } = useFormikContext(); // Access formikValues directly

    const [isFocused, setIsFocused] = useState(false);
    const [localValue, setLocalValue] = useState('');
    const animationValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Set initial localValue from formikValues
        setLocalValue(formikValues[name] || ''); 
    }, [formikValues, name]);

    useEffect(() => {
        Animated.timing(animationValue, {
            toValue: isFocused || localValue || formikValues[name] ? 1 : 0, // Include formikValues[name]
            duration: 250,
            useNativeDriver: false,
        }).start();
    }, [isFocused, localValue, formikValues, name]); // Add formikValues and name to dependencies


    const handleChangeText = (text) => {
        setLocalValue(text);
        onInputChange && onInputChange(text);
    };

    let inputLabel = label || placeholder;
    return (
        <Field
            name={name}
            validate={(value) => (!value && required ? `${label} is required` : '')}
        >
            {({ field, form }) => (
                <View
                    style={[
                        styles.textContainer,
                        {
                            borderColor: errors[name] ? 'red' : editable ? 'gray' : 'lightgray',
                            borderWidth: 1,
                        },
                    ]}
                >
                    <Animated.Text
                        style={{
                            position: 'absolute',
                            left: 10,
                            top: animationValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [15, -10],
                            }),
                            fontSize: animationValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [16, 12],
                            }),
                            color: field.value || isFocused || localValue || formikValues[name] ? 'black' : 'gray', // Include formikValues[name]
                            fontWeight: 'bold',
                            backgroundColor: 'white',
                            paddingHorizontal: 5,
                            zIndex: 1,
                        }}
                    >
                        {placeholder || label}
                    </Animated.Text>
                    <TextInput
                        value={field.value || localValue}
                        onBlur={() => {
                            form.setFieldTouched(name, true);
                            setIsFocused(false);
                        }}
                        editable={editable}
                        multiline={multiline}
                        keyboardType={keyboardType}
                        placeholder={placeHolderShow ? placeholder || title || label : title}
                        secureTextEntry={secureTextEntry}
                        onChangeText={(text) => {
                            form.setFieldValue(name, text);
                            handleChangeText(text);
                        }}
                        onFocus={() => setIsFocused(true)}
                        style={styles.textInputStyle}
                        placeholderTextColor={Color.PLACEHOLDER_TEXT}
                        maxLength={maxLength}
                        underlineColorAndroid={'transparent'}
                        returnKeyType="done"
                    />

                    <View>
                        {errors && errors[name] && errors[name] !== undefined && (
                            <Text style={styles.errorText}>{errors[name]}</Text>
                        )}
                    </View>
                </View>
            )}
        </Field>
    );
};

const styles = StyleSheet.create({
    errorText: {
        fontSize: 12,
        color: 'red',
        marginBottom:10,
    },
    textInputStyle: {
        height: 35, // Add a height for the TextInput
        paddingHorizontal: 10,
    },
    textContainer: {
        backgroundColor: 'white',
        width: '100%',
        minWidth: '100%',
        borderColor: 'gray',
        borderRadius: 8,
        paddingVertical:10,
        height : 50,
        marginTop:10,
        marginBottom:10
    },
});

export default CustomTextInput;