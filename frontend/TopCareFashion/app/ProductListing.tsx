// ProductListing.tsx  – fills dropdowns quietly with AI guesses
// Requires: POST /predict  (see backend file below)

import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, Image, TouchableOpacity, ScrollView, StyleSheet,
  Alert, ActivityIndicator, SafeAreaView, StatusBar, KeyboardAvoidingView,
  Platform, Modal, FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import API from "../lib/api";

// ────────────────────────────────────────────────────────────────────────────────
export default function ProductListing() {
  const router = useRouter();

  /* ------------------------------ state ------------------------------ */
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "", description: "", price: "",
    size: "", gender: "",
    category: "", condition: "", color: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading]   = useState(false);
  const [show, setShow] = useState({
    category:false, condition:false, size:false, gender:false, color:false,
  });

  /* --------------------------- permissions --------------------------- */
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Photo library access is required.");
      }
    })();
  }, []);

  /* ----------------------------- lists ------------------------------- */
  const categories  = ["Tops","Bottoms","Dresses","Outerwear","Footwear"];
  const conditions  = ["New with tags","Like new","Excellent","Good","Fair","Poor"];
  const colors      = ["Black","White","Red","Blue","Green","Yellow","Pink",
                       "Purple","Brown","Gray","Beige","Multicolor"];
  const clothingSz  = ["XS","S","M","L","XL","XXL","One Size"];
  const footwearSz  = ["35","36","37","38","39","40","41","42","43","44","45","46","47","48"];
  const genders     = ["Men","Women","Unisex"];
  const sizeOpts    = () => form.category === "Footwear" ? footwearSz : clothingSz;

  /* -------------------------- AI prediction -------------------------- */
  const runPrediction = async (img64: string) => {
    try {
      const { data } = await API.post("/predict", { image: img64 });
      setForm(f => ({
        ...f,
        category  : f.category   || data.category,
        condition : f.condition  || data.condition,
        color     : f.color      || data.color,
      }));
      setErrors(e => ({ ...e, category:"", condition:"", color:"" }));
    } catch (err) {
      console.warn("AI prediction failed:", err);
    }
  };

  /* -------------------------- image picker --------------------------- */
  const pickImage = async () => {
    if (images.length >= 5) {
      return Alert.alert("Maximum Images","You can only upload up to 5 images");
    }
    try {
      const r = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing:true, base64:true, quality:0.8,
      });
      if (!r.canceled && r.assets?.length) {
        const b64 = r.assets[0].base64;
        if (!b64) return;
        const imgStr = `data:image/jpeg;base64,${b64}`;
        setImages(arr => [...arr, imgStr]);
        setErrors(e=>({...e,images:""}));
        if (images.length === 0) runPrediction(imgStr);   // first image only
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error","Could not pick image.");
    }
  };
  const removeImage = (i:number)=>setImages(arr=>arr.filter((_,idx)=>idx!==i));

  /* --------------------------- validation ---------------------------- */
  const validate = ()=>{
    const e:Record<string,string>={};
    if(!form.title.trim()) e.title="Product title is required";
    if(!form.description.trim()) e.description="Description is required";
    if(!form.price.trim() || isNaN(+form.price) || +form.price<=0) e.price="Valid price is required";
    if(images.length===0) e.images="At least one image is required";
    if(!form.category) e.category="Category is required";
    if(!form.condition) e.condition="Condition is required";
    if(!form.color) e.color="Color is required";
    if(!form.size) e.size="Size is required";
    setErrors(e); return Object.keys(e).length===0;
  };

  /* ------------------------------ submit ----------------------------- */
  const handleSubmit = async ()=>{
    if(!validate()) return;
    setIsLoading(true);
    try{
      await API.post("/listings",{...form, price:+form.price, images});
      Alert.alert("Success","Your product has been listed!",[
        {text:"View My Listings",onPress:()=>router.push("/my-listings")},
        {text:"Continue Shopping",style:"cancel",onPress:()=>router.push("/Homepage")},
      ]);
    }catch(err:any){
      console.error(err);
      Alert.alert("Error",err.response?.data?.message||err.message);
    }finally{ setIsLoading(false); }
  };

  /* ----------------------------- helpers ----------------------------- */
  const InputRow = ({label,required,error,children}:{label:string,required?:boolean,error?:string,children:React.ReactNode})=>(
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}{required && <Text style={styles.req}>*</Text>}</Text>
      {children}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );

  const DropdownRow = ({label,value,modal,options,required}:{
    label:string, value:string, modal:keyof typeof show, options:string[], required?:boolean;
  })=>(
    <InputRow label={label} required={required} error={errors[modal]}>
      <TouchableOpacity
        style={[styles.input, errors[modal] && styles.inputError]}
        onPress={()=>setShow(s=>({...s,[modal]:true}))}
      >
        <View style={styles.dropdownContent}>
          <Text style={[styles.inputText,!value&&styles.placeholder]}>
            {value || `Select ${label.toLowerCase()}`}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#777" />
        </View>
      </TouchableOpacity>

      <Modal visible={show[modal]} transparent animationType="slide"
             onRequestClose={()=>setShow(s=>({...s,[modal]:false}))}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <TouchableOpacity onPress={()=>setShow(s=>({...s,[modal]:false}))}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={item=>item}
              renderItem={({item})=>(
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={()=>{
                    setForm(f=>({...f,[modal]:item}));
                    setErrors(e=>({...e,[modal]:""}));
                    setShow(s=>({...s,[modal]:false}));
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                  {value===item && <Ionicons name="checkmark" size={22} color="#0077b3" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </InputRow>
  );

  /* ------------------------------ render ----------------------------- */
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS==="ios"?"padding":"height"} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Images */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Images<Text style={styles.req}>*</Text></Text>
            <Text style={styles.sectionSub}>Upload up to 5 images (first image auto-fills details)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imgScroll}>
              {images.map((uri,idx)=>(
                <View key={idx} style={styles.imgWrap}>
                  <Image source={{uri}} style={styles.imgPrev}/>
                  <TouchableOpacity style={styles.removeBtn} onPress={()=>removeImage(idx)}>
                    <Ionicons name="close-circle" size={24} color="#ff3b30"/>
                  </TouchableOpacity>
                </View>
              ))}
              {images.length<5 && (
                <TouchableOpacity style={styles.addImgBtn} onPress={pickImage}>
                  <Ionicons name="camera-outline" size={36} color="#0077b3"/>
                  <Text style={styles.addTxt}>Add Photo</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
            <Text style={styles.imgCount}>{images.length}/5 images</Text>
            {errors.images && <Text style={styles.error}>{errors.images}</Text>}
          </View>

          {/* Classification */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Classification</Text>
            <DropdownRow label="Category"  value={form.category}  modal="category"  options={categories} required/>
            <DropdownRow label="Condition" value={form.condition} modal="condition" options={conditions} required/>
            <DropdownRow label="Color"     value={form.color}     modal="color"     options={colors}     required/>
          </View>

          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <InputRow label="Product Title" required error={errors.title}>
              <TextInput style={[styles.input,errors.title&&styles.inputError]}
                placeholder="e.g. Men's Plaid Shirt"
                value={form.title} onChangeText={t=>setForm(f=>({...f,title:t}))}/>
            </InputRow>
            <InputRow label="Description" required error={errors.description}>
              <TextInput style={[styles.textArea,errors.description&&styles.inputError]}
                placeholder="Include details about material, fit, etc."
                multiline numberOfLines={4} textAlignVertical="top"
                value={form.description} onChangeText={t=>setForm(f=>({...f,description:t}))}/>
            </InputRow>
            <InputRow label="Price (S$)" required error={errors.price}>
              <TextInput style={[styles.input,errors.price&&styles.inputError]}
                placeholder="e.g. 25.00" keyboardType="numeric"
                value={form.price} onChangeText={t=>setForm(f=>({...f,price:t}))}/>
            </InputRow>
          </View>

          {/* Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <DropdownRow
              label={form.category==="Footwear"?"Shoe Size":"Size"}
              value={form.size} modal="size" options={sizeOpts()} required
            />
            <DropdownRow label="Gender" value={form.gender} modal="gender" options={genders} />
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, isLoading && {opacity:0.7}]}
            onPress={handleSubmit} disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color="white"/> :
              <Text style={styles.submitTxt}>List Item for Sale</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* -------------------------------- styles -------------------------------- */
const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:"#f8f8f8"}, flex:{flex:1},
  container:{padding:20,paddingBottom:40},
  section:{backgroundColor:"white",borderRadius:10,padding:15,marginBottom:20,
           shadowColor:"#000",shadowOffset:{width:0,height:1},shadowOpacity:0.1,shadowRadius:2,elevation:2},
  sectionTitle:{fontSize:18,fontWeight:"bold",marginBottom:15,color:"#333"},
  sectionSub:{fontSize:14,color:"#666",marginBottom:10},
  req:{color:"#ff3b30"},
  /* images */
  imgScroll:{flexDirection:"row",marginVertical:10},
  imgWrap:{position:"relative",marginRight:10},
  imgPrev:{width:100,height:100,borderRadius:8,borderWidth:1,borderColor:"#ddd"},
  removeBtn:{position:"absolute",top:-8,right:-8,backgroundColor:"white",borderRadius:12,width:24,height:24,
             justifyContent:"center",alignItems:"center"},
  addImgBtn:{width:100,height:100,borderRadius:8,borderWidth:1,borderStyle:"dashed",borderColor:"#0077b3",
             justifyContent:"center",alignItems:"center",marginRight:10},
  addTxt:{fontSize:12,color:"#0077b3",marginTop:5},
  imgCount:{fontSize:12,color:"#666",marginTop:5,textAlign:"right"},
  /* input */
  inputContainer:{marginBottom:15},
  label:{fontSize:16,marginBottom:6,color:"#333",fontWeight:"500"},
  input:{borderWidth:1,borderColor:"#ccc",borderRadius:8,padding:12,backgroundColor:"#f9f9f9",fontSize:16},
  dropdownContent:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
  inputText:{fontSize:16,color:"#333"}, placeholder:{color:"#aaaaaa"},
  inputError:{borderColor:"#ff3b30"},
  textArea:{borderWidth:1,borderColor:"#ccc",borderRadius:8,padding:12,
           backgroundColor:"#f9f9f9",fontSize:16,minHeight:100,textAlignVertical:"top"},
  /* errors & submit */
  error:{color:"#ff3b30",fontSize:14,marginTop:5},
  submitBtn:{backgroundColor:"#0077b3",borderRadius:8,padding:15,alignItems:"center",marginTop:10},
  submitTxt:{color:"white",fontSize:18,fontWeight:"bold"},
  /* modal */
  modalOverlay:{flex:1,backgroundColor:"rgba(0,0,0,0.5)",justifyContent:"flex-end"},
  modalContent:{backgroundColor:"white",borderTopLeftRadius:20,borderTopRightRadius:20,maxHeight:"70%"},
  modalHeader:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",padding:15,borderBottomWidth:1,borderBottomColor:"#eee"},
  modalTitle:{fontSize:18,fontWeight:"bold",color:"#333"},
  modalItem:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",padding:15,borderBottomWidth:1,borderBottomColor:"#eee"},
  modalItemText:{fontSize:16,color:"#333"},
});
