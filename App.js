import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import OTP from "./index";

export default function App() {
  const [otpVerificationStatus, setOtpVerificationStatus] = useState(false); // false: pending/error, true, success
  return (
    <View style={styles.container}>
      {!otpVerificationStatus ? (
        <>
          <OTP verificationStatus={setOtpVerificationStatus} />
        </>
      ) : (
        <>
          <View style={styles.container}>
            <Text>Welcome to the Rakshak Application</Text>
            <Text>.. Scanning of QR code ..</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
