import React from 'react';

import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Color } from '../../helper/Color';

import { verticalScale } from "../Metrics";

import AlertMessage from '../../helper/AlertMessage';

function DeleteModal({ toggle, modalVisible, CancelAction, item, updateAction, id, titleMessage, confirmationMessage }) {
    return (
        <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                toggle && toggle();
            }}>
            <View style={styles.container}>

                <View style={styles.modalContainer}>

                    <View style={styles.modalHeader}>
                        <Text style={styles.title}>{titleMessage? titleMessage: 'Delete Confirmation'}</Text>
                    </View>

                    <View style={styles.divider}></View>

                    {id ? (
                        <View style={styles.modalBody}>
                        <View style={{ paddingHorizontal: 10 }}>
                            <Text>{AlertMessage.DELETE_MODAL} #{id}</Text>
                        </View>
                        </View>
                    ) : (
                        <View style={styles.modalBody}>
                            <View style={{ paddingHorizontal: 10 }}>
                                <Text>{confirmationMessage ?  confirmationMessage: AlertMessage.DELETE_MODAL_DESCRIPTION}</Text>
                            </View>
                            {item ?
                                <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
                                    <Text style={{ fontSize: 20 }}>Order#:{item?.order_number}</Text>
                                </View>
                                : <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
                                    <Text style={{ fontSize: 20 }}>{item?.name}</Text>
                                </View>
                            }
                        </View>
                    )}


                    <View style={styles.divider} />

                    <View style={styles.modalFooter}>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <TouchableOpacity style={{ flex: 0.5, alignItems: 'center', backgroundColor: Color.PRIMARY, justifyContent: 'center', borderBottomLeftRadius: 5 }} onPress={() => {
                                toggle && toggle();
                                updateAction && updateAction(item?.inventoryTransferProductId);
                            }}>
                                <Text style={{ color: Color.PRIMARY_TEXT, fontSize: 15, fontWeight: "700" }}>OK</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flex: 0.5, alignItems: 'center', backgroundColor: Color.SECONDARY, justifyContent: 'center', borderBottomRightRadius: 4.7 }} onPress={() => {
                                toggle && toggle();
                                CancelAction && CancelAction();
                            }} >
                                <Text style={{ color: Color.PRIMARY_TEXT, fontSize: 15, fontWeight: "700" }}>CANCEL</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>
            </View>
        </Modal>
    );
}

export default DeleteModal;

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#00000099",
    },
    modalContainer: {
        width: "80%",
        height: verticalScale(300),
        borderRadius: 5,
        flex: 0.3,
        backgroundColor: "#f9fafb",
    },
    modalHeader: {
        flex: 0.2,
        justifyContent: "center",
    },
    modalBody: {
        flex: 0.6,
        backgroundColor: "#fff",
        paddingVertical: 5,
        // paddingHorizontal: 10,
        justifyContent: "center",
        // alignItems: "center"
    },
    modalFooter: {
        flex: 0.2,
    },
    title: {
        fontWeight: "bold",
        // fontSize: 15,
        paddingHorizontal: 15,
        color:Color.BLACK
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "lightgray"
    },
    actions: {
        borderRadius: 5,
        marginHorizontal: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#db2828"
    },
    actionText: {
        color: "#fff"
    },
    imageStyle: {
        flex: 1,
        flexDirection: "row"
    }
});