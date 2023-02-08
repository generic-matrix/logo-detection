import React,{useState} from 'react';
import { StyleSheet,Text, ScrollView, View, TouchableOpacity,ActivityIndicator,Alert,Image} from 'react-native';
import {launchImageLibrary}  from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import callGoogleVisionAsync from './GoogleVision.js';
import CropImages from './CropImages.js';
const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    padding : 20
  },
  title: {
    fontSize: 35,
    marginVertical: 40,
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 10,
    textAlign:'center'
  },
  desc: {
    fontSize: 12,
    marginVertical: 10,
    textAlign:'center'
  },
  languagetitle: {
    fontSize: 30,
    marginVertical: 10,
    textAlign:'center'  
  },
  image: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 75
  },
  button: {
    backgroundColor: '#47477b',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginTop: 20,
    marginBottom:20
  },
  buttonText: {
    color: '#fff',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'center'
  }
});


export default function App() {
  const [label, setLabels] = useState([]);
  const [loading, SetLoading] = useState(false);

  async function SelectPhoto(){
    SetLoading(true)
    const options = {
      mediaType:'photo'
    }
    const result = await launchImageLibrary(options)
    if(result.assets===undefined){
      // Some error log it as toast , you an parse the error to be more specific . Refer the docs
      Alert.alert('Error',"Could not pick an image", [
        {text: 'OK'},
      ]);
      SetLoading(false)
    }else{
      // convert to base64
      RNFS.readFile(result.assets[0].uri, 'base64')
      .then(res =>{
        callGoogleVisionAsync(res).then(async (data)=>{
          const labels=await CropImages(result.assets[0].uri,data);
          setLabels(labels)
          SetLoading(false)
        }).catch((error)=>{
          Alert.alert('Error',error+"", [
            {text: 'OK'},
          ]);
          SetLoading(false)
        })
      }).catch((error)=>{
        Alert.alert('Error',"Could convert image to base64", [
          {text: 'OK'},
        ]);
        SetLoading(false)
      });
    }
  }
  
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Logo Detection</Text>
      <Text style={styles.subtitle}>Detect logo in a image</Text>
      <ScrollView horizontal={true}>
      </ScrollView>
      <View>
        <TouchableOpacity style={styles.button} onPress={SelectPhoto}>
        <Text style={styles.buttonText}>Pick a Photo</Text>
        </TouchableOpacity >
          {
            (loading===false)?
            <View style={styles.column}>
              {
                Object.keys(label).map((index) => {
                  return (
                    <View key={index} style={{
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Image key={index} source={{ uri: label[index].uri }} style={styles.image}/>
                      <Text style={styles.desc}>{label[index].description}</Text>
                    </View>
                  )
                })
              }
            </View>
            :<ActivityIndicator size="large" />
            
          }
      </View>
  </ScrollView>
  );
}

