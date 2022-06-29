import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  BackHandler,
} from "react-native";
import React, { useRef, useState } from "react";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig } from "./config";
import firebase from "firebase/compat/app";

const OTP = (props) => {
  const [mobileNumber, setmobileNumber] = useState("");
  const [code, setCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const recaptchaVerifier = useRef(null);
  const [enteringMobileNumber, setEnteringMobileNumber] = useState(true);
  const countryCode = "+91"; // currently for India..

  const sendVerification = () => {
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    let isMobileNum = /^\d{10}$/.test(mobileNumber); // RegEx check.. MUST only contain the digits of length 10
    if (!isMobileNum) {
      Alert.alert("Error", "Please enter a valid 10 digit mobile number.");
    } else {
      // if (mobileNumber.length == 10) {
      // if (alert("Entered mobie number: " + mobileNumber)) {
      Alert.alert(
        "Confirmation",
        "Entered mobile number: " + countryCode + mobileNumber,
        [
          {
            text: "Correct, Proceed",
            onPress: () => {
              // Show the captcha..
              phoneProvider
                .verifyPhoneNumber(
                  countryCode + mobileNumber,
                  recaptchaVerifier.current
                )
                .then(setVerificationId)
                .catch((error) => {
                  Alert.alert("Error", "" + error);
                });

              // move to OTP screen..
              setEnteringMobileNumber(false);
            },
          },
          {
            text: "Mistake, need correction",
            onPress: () => {},
          },
        ]
      );

      // }
    }
  };

  const confirmCode = () => {
    let isOTP = /^\d{6}$/.test(code); // RegEx check.. MUST only contain the digits of length 6
    if (isOTP) {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        code
      );
      firebase
        .auth()
        .signInWithCredential(credential)
        .then(() => {
          setCode("");
        })
        .catch((error) => {
          // alert to show error..
          // Alert.alert('Authentication Error',''+error);// this gives, actual error -- If ran into issue, uncomment this and check,
          Alert.alert(
            "Authentication Error",
            "Incorrect OTP entered, please re-try."
          );
        });

      Alert.alert("Login Success", "Welcome to the Application");
      props.verificationStatus(true); // Inform to parent, so that, can move to next activity.
    } else Alert.alert("Invalid Input Error", "Please enter proper OTP.");
  };

  function quitApplication() {
    // write code.. BackHandler.exitApp() <- to exit app..
    Alert.alert(
      // Title..
      "Confirmation",
      //Body
      "Are you sure to exit?",
      [
        {
          text: "Yes",
          onPress: () => {
            // Set all state to default..
            setEnteringMobileNumber(false);
            setmobileNumber("");
            setCode("");
            // Finally, exit the app
            BackHandler.exitApp();
          },
        },
        {
          text: "No",
          onPress: () => {
            console.log("Do nothing");
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
      <View style={styles.titles}>
        <Text style={styles.appName}>Rakshak</Text>
        <Text style={styles.otpText}>OTP Authentication Panel</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.userInputSection}>
          {enteringMobileNumber ? (
            <>
              <Text>Enter Mobile number</Text>
              <View style={styles.mobileNumberView}>
                {/* For now, assuming that, application runs in India only */}
                <Text style={styles.countryCodeTxt}>{countryCode}</Text>
                <TextInput
                  placeholder="Mobile Number"
                  onChangeText={setmobileNumber}
                  keyboardType="number-pad"
                  maxLength={10}
                  style={styles.mobileNumberTxtInput}
                />
              </View>
              <TouchableOpacity
                style={styles.sendVerification}
                onPress={sendVerification}
              >
                <Text style={styles.OTPbtn}>Request OTP</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View>
                <Text>Enter 6 digit OTP sent to</Text>
                <Text>Mobile Number: {countryCode + mobileNumber}</Text>

                <TextInput
                  placeholder="• • • • • •"
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  maxLength={6} // as per Firebase, its 6digits.
                  style={styles.OTPTxtInput}
                />

                <TouchableOpacity style={styles.sendCode} onPress={confirmCode}>
                  <Text style={styles.OTPbtn}>Verify OTP</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.quitApplicationBtn}
          onPress={quitApplication}
        >
          <Text style={styles.quitApplicationTxt}>Quit Application</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OTP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  titles: {
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    alignItems: "center",
    justifyContent: "center",
    height: "60%",
    width: "100%",
  },
  appName: {
    fontSize: 30,
    fontWeight: "600",
    color: "#000",
  },
  otpText: {
    fontSize: 18,
    fontWeight: "400",
    color: "#666666",
    // margin: 20,
    // backgroundColor: "#7BFBFF",
  },

  userInputSection: {
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#f6f8fa",
    borderRadius: 10,
    borderColor: "#D2D2D2",
    borderWidth: 0.5,
    padding: 30,
    paddingBottom: 0,
    marginTop: 60,
  },
  mobileNumberView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    // width: "100%",
    // paddingLeft: 30,
  },
  countryCodeTxt: {
    fontSize: 20,
    padding: 6,
    paddingRight: 5,
    paddingLeft: 10,
    color: "#525252",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: "#D2D2D2",
    borderWidth: 0.8,
    borderRightWidth: 0,
    // margin: 0
  },
  mobileNumberTxtInput: {
    flex: 1,
    fontSize: 20,
    paddingLeft: 5,
    padding: 6,
    textAlign: "left",
    color: "#000",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: "#D2D2D2",
    borderWidth: 0.8,
    borderLeftWidth: 0,
  },
  OTPTxtInput: {
    marginTop: 40,
    paddingHorizontal: 20,
    padding: 4,
    fontSize: 24,
    borderColor: "#D2D2D2",
    borderWidth: 0.8,
    marginBottom: 2,
    textAlign: "center",
    color: "#000",
    letterSpacing: 4,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    // fontFamily:'sans serif' // set coding font.
  },
  sendVerification: {
    padding: 20,
    backGroundColor: "#3498db",
    borderRadius: 20,
  },
  sendCode: {
    padding: 20,
    backGroundColor: "#9b59b6",
    borderRadius: 10,
  },
  OTPbtn: {
    // flex: 1,
    textAlign: "center",
    fontWeight: "normal",
    fontSize: 18,
    color: "#FFFFFF",
    backgroundColor: "#2da44e",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 40,
    paddingRight: 40,
    marginTop: 10,
    borderRadius: 10,
  },

  quitApplicationBtn: {
    backgroundColor: "#FF6262",
    color: "#fff",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    marginTop: 50,
    // bottom:10,
    // left:20
  },
  quitApplicationTxt: {
    color: "#ffffff",
    fontSize: 14,
  },
});
