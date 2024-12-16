import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Form from "../../MyComponents/Form";
import Layout from "../../MyComponents/Layout";
import CustomTextInput from "../../MyComponents/TextInput";
import AsyncStorage from "../../lib/AsyncStorage";

const STORAGE_KEY = "accounts";

const Setting = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const formRef = useRef(null);
  const [swipedRow, setSwipedRow] = useState(null);


  const swipeableRefs = useRef({});

  // Toggle Modal
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // Fetch Accounts on Load
  useEffect(() => {
    getAccounts();
  }, []);

  const getAccounts = async () => {
    try {
      let data = await AsyncStorage.getJSONItem(STORAGE_KEY);
      if (data) setAccounts(data);
    } catch (error) {
      console.log("Error fetching accounts:", error);
    }
  };

  // Add or Update Account
  const handleFormSubmit = async (values) => {
    try {
      let updatedAccounts = [...accounts, values];
      await AsyncStorage.setJSONItem(STORAGE_KEY, updatedAccounts);
      setAccounts(updatedAccounts);
      toggleModal();
    } catch (error) {
      console.log("Error saving account:", error);
    }
  };

  // Delete an Account
  const handleDelete = async (index) => {
    try {
      let updatedAccounts = accounts.filter((_, i) => i !== index);
      await AsyncStorage.setJSONItem(STORAGE_KEY, updatedAccounts);
      setAccounts(updatedAccounts);
      swipeableRefs.current[index]?.close();
    } catch (error) {
      console.log("Error deleting account:", error);
    }
  };

  // Swipeable Right Actions
  const renderRightActions = (index) => (
    <View style={styles.swipeActions}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(index)}
      >
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.swipCancelButton} onPress={() => swipeableRefs.current[index]?.close()}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  // Render Each Row
  const renderItem = ({ item, index }) => (
    <Swipeable
      ref={(ref) => (swipeableRefs.current[index] = ref)}
      renderRightActions={() => renderRightActions(index)}
      friction={0.5}
      overshootFriction={6}
      onSwipeableOpen={() => {
        if (swipedRow !== null && swipedRow !== index) {
          swipeableRefs.current[swipedRow]?.close();
        }
        setSwipedRow(index);
      }}
      onSwipeableClose={() => {
        if (swipedRow === index) {
          setSwipedRow(null);
        }
      }}
    >
      <View style={styles.row}>
        <Text style={styles.text}>{`Bank: ${item?.bank_name}`}</Text>
        <Text style={styles.text}>{`Recipient: ${item?.recipient_name}`}</Text>
        <Text style={styles.text}>{`UPI ID: ${item?.upi_id}`}</Text>
      </View>
    </Swipeable>
  );
  return (
    <Layout HeaderLabel="Setting" showHeader showSetting icon="plus" onSettingsPress={() => toggleModal()}>
      {/* FlatList for Accounts */}
      <FlatList
        data={accounts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No Accounts Found</Text>}
        getItemLayout={(data, index) => ({
          length: 60, // height of each row
          offset: 60 * index,
          index,
        })}
      />

      {/* Modal for Adding Account */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Account</Text>
            <Form
              initialValues={{ recipient_name: "", bank_name: "", upi_id: "" }}
              onSubmit={handleFormSubmit}
              ref={formRef}
            >
              <CustomTextInput name="recipient_name" label="Recipient Name" required />
              <CustomTextInput name="bank_name" label="Bank Name" required />
              <CustomTextInput name="upi_id" label="UPI ID" required />
            </Form>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={() => formRef.current.submitForm()}
              >
                <Text style={styles.saveButtonText}>Save</Text>
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
    </Layout>
  );
};

export default Setting;

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
