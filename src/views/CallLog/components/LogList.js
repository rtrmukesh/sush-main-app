import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import CustomDivider from '../../../components/Divider';
import DateTime from '../../../lib/DateTime';
import String from '../../../lib/String';

const LogList = (props) => {
    const { data } = props;

    const renderItem = ({ item }) => (
        <>
            <View style={styles.card}>
                <View style={styles.row}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{item?.name ? item?.name : item?.phoneNumber}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Phone:</Text>
                    <Text style={styles.value}>{item?.phoneNumber}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Type:</Text>
                    <Text style={styles.value}>{String.toCamelCase(item?.type)}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Date:</Text>
                    <Text style={styles.value}>{item?.dateTime}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Duration:</Text>
                    <Text style={styles.value}>{DateTime.formatDuration(item?.duration)}</Text>
                </View>
            </View>
            <CustomDivider />
        </>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerBar}>
                <Text style={styles.headerText}>Logs</Text>
            </View>
         {(data && data.length > 0) &&  <FlatList
                data={data}
                keyExtractor={(item) => item?.id?.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: "#f9f9f9",
    },
    headerBar: {
        backgroundColor: "#212529",
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    listContent: {
        padding: 10,
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        elevation: 2,
    },
    row: {
        flexDirection: "row",
        marginBottom: 5,
    },
    label: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#555",
        width: 100, 
    },
    value: {
        fontSize: 16,
        color: "#333",
        flexShrink: 1, 
    },
});

export default LogList;
