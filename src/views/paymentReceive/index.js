import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import { TextInput, Button, Text, Card, Title, Divider } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '../../lib/AsyncStorage';
import { useNavigation } from '@react-navigation/native';
import ArrayList from '../../lib/ArrayList';

const STORAGE_KEY = "accounts";


const PaymentRecevie = () => {
  const [amount, setAmount] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState([]);
  const [accounts, setAccounts] = useState([]);

  let navigation = useNavigation()


  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        let paymentArray = await AsyncStorage.getJSONItem(STORAGE_KEY);
        setAccounts(paymentArray || []);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  const handleAmountChange = (input) => {
    setAmount(input);
  };

  const generateQRCode = async () => {
    if (!ArrayList.isArray(accounts)) {
      Alert.alert(
        "Missing",
        "Plese Add Bank Account",
        [
          {
            text: "Add",
            onPress: () => {
              navigation.navigate("Setting");
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        Alert.alert("Invalid amount", "Please enter a valid amount.");
        return;
      }
    }

    let loopedData = accounts.map((payment) => {
      const { upi_id, recipient_name } = payment;
      const formattedAmount = parseFloat(amount).toFixed(2);
      const qrData = `upi://pay?pa=${upi_id}&pn=${recipient_name}&mc=${formattedAmount}&am=${amount}&tid=txn${Date.now()}&cu=INR&url=`;

      return {
        ...payment,
        qr_query: qrData,
      };
    });

    setQrCodeValue(loopedData);
  };

  const renderQRCodeItem = ({ item }) => (
    <Card style={styles.qrCard}>
      <Card.Content>
        <View style={styles.qrContainer}>
          <Text style={styles.bankName}>{item.bank_name}</Text>
          <Text style={styles.recipientDetails}>
            {item.recipient_name} • {item.upi_id}
          </Text>
          <Divider style={styles.qrDivider} />
          <QRCode value={item.qr_query} size={200} />
          <Text style={styles.amountText}>₹{amount}</Text>
          <Text style={styles.instructions}>Scan this QR code to pay</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.heading}>Payment QR Generator</Title>
          <Divider style={styles.divider} />
          <TextInput
            label="Enter Amount"
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={generateQRCode}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Generate QR Codes
          </Button>
        </Card.Content>
      </Card>

      {qrCodeValue.length > 0 && (
        <FlatList
          data={qrCodeValue}
          renderItem={renderQRCodeItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContainer}
          snapToAlignment="center"
          snapToInterval={Dimensions.get('window').width - 40} // Adjust the width here
          decelerationRate="fast"
        />

      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  divider: {
    marginVertical: 10,
    backgroundColor: '#6200ee',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 5,
  },
  buttonText: {
    fontSize: 16,
  },
  flatListContainer: {
    paddingVertical: 20,
  },
  qrCard: {
    borderRadius: 12,
    elevation: 4,
    marginHorizontal: 18,
  },
  qrContainer: {
    alignItems: 'center',
    padding: 20,
  },
  bankName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recipientDetails: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  qrDivider: {
    marginVertical: 10,
    backgroundColor: '#6200ee',
    width: '80%',
    alignSelf: 'center',
  },
  amountText: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructions: {
    marginTop: 8,
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
});

export default PaymentRecevie;
