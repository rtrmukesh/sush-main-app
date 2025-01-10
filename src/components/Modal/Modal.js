import React, { useRef, useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Form from "../../MyComponents/Form";


const SlideModal = (props) => {
    let { buttonLabel, initialValues = {}, title, children, setModalVisible, isModalVisible, handleFormSubmit } = props;
    const formRef = useRef(null);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={toggleModal}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <Form
                        initialValues={initialValues}
                        onSubmit={handleFormSubmit}
                        ref={formRef}
                    >
                        {children}
                    </Form>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={() => formRef.current.submitForm()}
                        >
                            <Text style={styles.saveButtonText}>{buttonLabel}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={toggleModal}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

export default SlideModal;

const styles = StyleSheet.create({
    addButton: {
        backgroundColor: "#A3D700",
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
        position: "absolute",
        bottom: 20,
        right: 20,
        elevation: 5,
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },
    swipeActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    deleteButton: {
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        width: 62,
        height: "100%",
    },
    cancelButton: {
        backgroundColor: "#ddd",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    row: {
        backgroundColor: "#fff",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    text: {
        fontSize: 16,
        color: "#333",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between", // Proper spacing between buttons
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: "#A3D700",
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
    cancelButtonText: {
        color: "#000",
        fontWeight: "bold",
        textAlign: "center",
    },
    emptyText: {
        textAlign: "center",
        color: "#777",
        marginTop: 20,
    },
    button: {
        flex: 1, // Ensures buttons are equal width
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginHorizontal: 5, // Adds spacing between buttons
    },
    swipCancelButton: {
        backgroundColor: "gray",
        justifyContent: "center",
        alignItems: "center",
        width: 62,
        height: "100%",
    }
});
