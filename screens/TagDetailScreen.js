import { View, Text, TouchableOpacity, Linking } from "react-native";
import React from "react";
import { Ndef } from "react-native-nfc-manager";

function TagDetailScreen(props) {
  const { route } = props;
  const { tag } = route.params;
  let uri = null;

  if (tag.ndefMessage && tag.ndefMessage.length > 0) {
    const ndefRecord = tag.ndefMessage[0];
    if (ndefRecord.tnf === Ndef.TNF_WELL_KNOWN) {
      if (ndefRecord.type.every((b, i) => b === Ndef.RTD_BYTES_URI[i])) {
        uri = Ndef.uri.decodePayload(ndefRecord.payload);
      }
    }
  }
  return (
    <View className="flex-1 justify-center items-center">
      {uri ? (
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(uri);
          }}
        >
          <Text>{uri}</Text>
        </TouchableOpacity>
      ) : (
        <Text className='text-black'>{JSON.stringify(tag, null, 2)}</Text>
      )}
    </View>
  );
}

export default TagDetailScreen;
