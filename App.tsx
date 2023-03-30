import { useState } from 'react';
import { Button, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import FormData from 'form-data';

export default function App() {
  const [mealName, setMealName] = useState<string>('Bang Bang Chicken')
  const [ingredients, setIngredients] = useState<Ingredient[]>([{'name': 'Chicken thigh', 'number': 600, 'quantity': 'grams'}, {'name': 'ginger', 'number': 4, 'quantity': 'slices'}, {'name': 'rice win', 'number': 1, 'quantity': 'tbsp'}, {'name': 'scallion', 'number': 2, 'quantity': 'stalk'}, {'name': 'Japanese cucumber', 'number': 1, 'quantity': ''}, {'name': 'sesame paste', 'number': 1, 'quantity': 'tbsp'}, {'name': 'soy sauce', 'number': 2, 'quantity': 'tbsp'}, {'name': 'black vinegar', 'number': 1, 'quantity': 'tbsp'}, {'name': 'chili oil', 'number': 2, 'quantity': 'tbsp'}, {'name': 'sugar', 'number': 1, 'quantity': 'tsp'}, {'name': 'red chili strips', 'number': 1, 'quantity': 'tbsp'}, {'name': 'white sesame', 'number': 1, 'quantity': 'tsp'}])
  const [nutrifacts, setNutrifacts] = useState<NutriFacts>()
  const [ingredient, setIngredient] = useState<string>('')
  const [image, setImage] = useState<string>();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getNutrifacts = () => {
    console.log('Getting Nutrifacts')
  }

  const addIngredient = (text: string) => {
    // const data = getNutrifacts()
    const data = {
      name: text,
      number: 10,
      quantity: 'unit(s)'
    }
    setIngredients((prevState) => {
      return [...prevState, data]
    })
    setIngredient('')
  }

  const removeIngredient = (ingredient: Ingredient) => {
    setIngredients((prevState) => {
      return prevState.filter((item) => item != ingredient)
    })
  }

  /*
    NutriCapture Flow:
      - Device takes photo
      - Photo uploaded to python ML algorithm
      - Output from algorithm sent to backend server (liDAR data from device)
      - When server recieves data it processes output makes call to FoodAPI
      - API nutrition facts, liDAR portion info, ingredient list and photo sent to react
  */

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{mealName}</Text>
      <View style={styles.image}>
        <Image source={{uri: image}} style={{width: 250, height: 250}}/>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Pressable style={styles.upload} onPress={pickImage}>
          <Text>Pick an image from camera roll</Text>
        </Pressable>
        <Pressable style={{...styles.upload, backgroundColor: 'black'}} onPress={() => getNutrifacts()}>
          <Text style={{color: 'white'}}>Get Nutrifacts</Text>
        </Pressable>
      </View>
      <View style={styles.nutrition}>
        <View style={styles.ingredients}>
          <Text style={{...styles.header2, alignSelf: 'center'}}>Ingredients</Text>
          <View style={{flexDirection: 'row'}}>
            <TextInput style={styles.input} placeholder='Add ingredient' value={ingredient} onChangeText={(text) => setIngredient(text)} />
            <Pressable style={{justifyContent: 'center', alignContent: 'center', flex: 1}} onPress={() => addIngredient(ingredient)}>
              <Text style={{fontWeight: "600"}}>Add</Text>
            </Pressable>
          </View>
          <FlatList style={styles.list} data={ingredients} renderItem={(data) => {
            return (<View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: 5}}>
              <Text style={styles.text}>{data.item.name}</Text>
              <Button color={"red"} title="X" onPress={() => removeIngredient(data.item)}/>
            </View>)
          }}/>
        </View>
        <View style={styles.macronutrition}>
          <Text style={{...styles.header2, alignSelf: 'center'}}>NutriFacts</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  header: {
    fontSize: 28,
    fontWeight: "600",
    margin: 5,
  },
  header2: {
    fontSize: 24,
    fontWeight: "600",
    margin: 5,
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    margin: 5,
  },
  input: {
    flex: 9,
    paddingVertical: 10,
    paddingLeft: 10,
    margin: 10,
    marginHorizontal: 25,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
  },
  list: {
    paddingRight: 15,
  },
  image: {
    margin: 25,
    alignItems: 'center',
    overflow: 'hidden'
  },
  upload: {
    backgroundColor: 'lightgray',
    borderRadius: 5,
    padding: 12,
    margin: 20,
  },
  nutrition: {
    flex: 1,
    margin: 25,
    flexDirection: 'row',
    width: '75%'
  },
  ingredients: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 2,
    borderRightWidth: 1,
  },
  macronutrition: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 2,
    borderLeftWidth: 1,
  }
});
