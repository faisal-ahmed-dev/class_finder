import {Platform, StyleSheet, Text, View, SafeAreaView,TouchableWithoutFeedback,Dimensions,TouchableOpacity,TextInput,Button,ScrollView ,FlatList } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import  { useState, useRef,useEffect } from 'react';
import moment from 'moment';
import Swiper from 'react-native-swiper';
const { width } = Dimensions.get('window');
import Modal from "react-native-modal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { StatusBar } from 'expo-status-bar';
import Calendar from '../components/horizontal_date/Calender';
import { AntDesign } from '@expo/vector-icons';
import ButtonToggleGroup from 'react-native-button-toggle-group';


import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import db from '../../api/src/model/db';



  
const Routine = () => {
    const swiper = useRef();
    const [value, setValue] = useState(new Date());
    const [week, setWeek] = useState(false);
    const [date, setDate] = useState(new Date())
    const [visible,setVisible]=useState(false);
    const [open, setOpen] = useState(false)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [buttonToggle, setButtonToggle] = React.useState('Light'); // Button toggle

    /* ------------------------------- Date Picker ------------------------------ */

    const [selectedDate, setSelectedDate] = useState(null);

    if(selectedDate==null)
    {
        setSelectedDate(moment(date).format('DD-MM-YYYY'));
    }


    const showDatePicker = () => {
    setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
    setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
    console.log("A date has been picked: ", date);
    hideDatePicker();
    };

    /* ------------------------------- Time picker start button ------------------------------ */
    const [isTimeStartPickerVisible, setTimeStartPickerVisibility] = useState(false);
    const [selectedStartTime, setSelectedStartTime] = useState(null);

    const showTimeStartPicker = () => {
        setTimeStartPickerVisibility(true);
        };
    
        const hideTimeStartPicker = () => {
        setTimeStartPickerVisibility(false);
        };
        
        const handleTimeStartConfirm = (time) => {
            time= new Date(time).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            setSelectedStartTime(time);
            hideTimeStartPicker();
            };
            
 /* ------------------------------- Time picker end button ------------------------------ */
    const [isTimeEndPickerVisible, setTimeEndPickerVisibility] = useState(false);
    const [selectedEndTime, setSelectedEndTime] = useState(null);

    const showTimeEndPicker = () => {
        setTimeEndPickerVisibility(true);
        };
    
        const hideTimeEndPicker = () => {
        setTimeEndPickerVisibility(false);
        };
        
        const handleTimeEndConfirm = (time) => {
            time= new Date(time).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            setSelectedEndTime(time);
            hideTimeEndPicker();
            };

            /* --------------------------------- database -------------------------------- */

            useEffect(() => {
                db.transaction(tx => {
                    tx.executeSql(`SELECT * FROM class where selectedDate='${selectedDate}'`, null,
                        (txObj, resultSet) => setCourseItems(resultSet.rows._array),
                        (txObj, error) => console.log(error)
                    );
                });

            },[selectedDate])
        
            const handleRoutineRefresh = () => { 
        
                console.log('refresh database');
                db.transaction(tx => {
                    tx.executeSql(`SELECT * FROM class where selectedDate='${selectedDate}'`, null,
                        (txObj, resultSet) => setCourseItems(resultSet.rows._array),
                        (txObj, error) => console.log(error)
                    );
                });
            
            }
            useEffect(() => {
            
                db.transaction(tx => {
                  tx.executeSql(`CREATE TABLE IF NOT EXISTS class (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    courseCode TEXT,
                    faculty TEXT,
                    building TEXT,
                    room TEXT,
                    selectedStartTime TEXT,
                    selectedEndTime TEXT,
                    selectedDate TEXT,
                    Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
                );`),
                  (txObj, resultSet) => {console.log("success database", resultSet)},
                  (txObj, error) => console.log(error)
                });
            
                    db.transaction(tx => {
                        tx.executeSql(`SELECT * FROM class where selectedDate='${selectedDate}'`, null,
                            (txObj, resultSet) => setCourseItems(resultSet.rows._array),
                            (txObj, error) => console.log(error)
                        );
                    });
                    
              }, [db]);

            /* ---------------------------- input validation ---------------------------- */

            const [courseCode, setCourseCode]=useState(null);
            const [faculty, setFaculty]=useState(null);
            const [building, setBuilding]=useState(null);
            const [room, setRoom]=useState(null);
            const [courseItems,setCourseItems]=useState([]);

            const handleRoutineAdd= ()=>{
            
                db.transaction(tx => {
                  tx.executeSql(`INSERT INTO class (courseCode, faculty, building, room, selectedStartTime, selectedEndTime,selectedDate)
                  VALUES ('${courseCode}', '${faculty}', '${building}', '${room}', '${selectedStartTime}', '${selectedEndTime}','${selectedDate}')
                  `, null,
                    (txObj, resultSet) => {console.log("success insert", resultSet)},
                    (txObj, error) => console.log(error)
                  );
                });

                  handleRoutineRefresh();
            
            }

            const handleRoutineDelete= (id)=>{

                db.transaction(tx => {
                    tx.executeSql(`Delete  FROM class where id=${id}`, null,
                      (txObj, resultSet) => {
                       handleRoutineRefresh();
                      },
                      (txObj, error) => console.log(error)
                    );
                  });
            }

          
        
    
        return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Your Class Routine</Text>
                </View>            
                <View  onPress={handleRoutineRefresh}  >
                    <Calendar  onSelectDate={setSelectedDate} selected={selectedDate ? selectedDate  : moment(date).format('DD-MM-YYYY')} />
                </View>
                <View style={{ flex: 1, flexDirection:'row' ,justifyContent:'space-between' , paddingHorizontal: 16, paddingVertical: 2 }}>
                    <Text  style={styles.subtitle}>{ (selectedDate ? selectedDate: moment(date).format('DD-MM-YYYY'))}</Text>
                    <View style={{width:wp(10), height:hp(3), border: 1,borderRadius:wp(15)}}>
                            <TouchableOpacity style={{color:'black'}} title="Show Date Picker"  onPress={showDatePicker}>
                                <View style={{ }}>
                                    <AntDesign name="calendar" size={24} color="black" />
                                </View>
                                    <DateTimePickerModal 
                                                    isVisible={isDatePickerVisible}
                                                    mode="date" 
                                                    onConfirm={handleConfirm}
                                                    onCancel={hideDatePicker}
                                    />
                                
                            </TouchableOpacity> 
                    </View>
                </View>
                <View style={{flexDirection:'column',justifyContent:'flex-start',alignItems:'flex-end',height:hp(54)}}>
                    <ScrollView>
                        {
                            courseItems.map((courseItem,index) =>{
                              
                            return  (
                               
                                <View key={index} style={{width: wp(94), margin:wp(1), marginHorizontal:wp(3), padding: wp(4),paddingHorizontal:wp(6),flexDirection:'row',justifyContent:'space-between',backgroundColor:'#323232',borderRadius:wp(5)}}>
                                    <View style={{width:wp(60)}}>
                                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>    
                                            <Text style={[styles.text]}>{courseItem.courseCode}</Text>
                                            <Text  style={[styles.text]}>B:{courseItem.building}</Text>
                                            <Text  style={[styles.text]}>{courseItem.selectedStartTime}</Text>
                                        </View>
                                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>    
                                            <Text  style={[styles.text]}>{courseItem.faculty}</Text>
                                            <Text  style={[styles.text]}>R: {courseItem.room}</Text>
                                            <Text  style={[styles.text]}>{courseItem.selectedEndTime}</Text>
                                        </View>
                                    </View>
                                    <View style={{marginHorizontal:wp(2),padding:wp(2),paddingHorizontal:wp(3),width:wp(30),flexDirection:'row',justifyContent:'space-between'}}>
                                        <TouchableOpacity><FontAwesome name="edit" size={24} color="white" /></TouchableOpacity>
                                        <TouchableOpacity onPress={()=>handleRoutineDelete(courseItem.id)}><MaterialIcons style={{left:wp(-8)}} name="delete" size={24} color="white" /></TouchableOpacity>
                                    </View>
                                </View>


                            )
                            })
                        }
                    </ScrollView>
                </View>
                    
                <View style={styles.footer}>
                    <TouchableOpacity
                        onPress={() => {
                            setVisible(true);
                            hideTimeStartPicker;
                            hideTimeEndPicker;
                        }}>
                        <View style={styles.btn}>
                            <Text style={styles.btnText}>ADD</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ backgroundColor:'#fff'}}>
                        <Modal animationIn={'slideInUp'} animationOut={'slideOutDown'} isVisible={visible}  onBackdropPress={()=>{ setVisible(false)}} onBackButtonPress={()=>{ setVisible(false)}}>
                            <View style={{ flex: 1 ,padding:20, position:'absolute',bottom:-20,left:-20,backgroundColor:'#fff',width:wp(100),height:hp(50),borderTopLeftRadius:wp(6),borderTopRightRadius:wp(6)}}>
                                <View style={{flexDirection:'row', justifyContent:'space-between',alignItems:'center'}}>
                                    <Text style={{fontSize:wp(4),fontWeight:700,marginBottom:hp(1),padding:1}}>ADD NEW CLASS ON {selectedDate ? selectedDate : moment(date).format('DD-MM-YYYY')} 
                                    </Text>
                                    <TouchableOpacity onPress={handleRoutineAdd}>
                                        <Text style={{ backgroundColor:"#141414",color:'white', padding:wp(1),marginBottom:hp(1), paddingHorizontal:wp(7),borderWidth: 1, borderRadius:wp(10)}}>ADD</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.flex_input}>
                                    <Text style={styles.label}>Course Code</Text>
                                    <TextInput onChangeText={text=>setCourseCode(text)}  style={styles.input}  placeholder="e.g.Cse 121"/>
                                </View>
                                <View style={styles.flex_input}>
                                    <Text style={styles.label}>Faculty</Text>
                                    <TextInput onChangeText={text=>setFaculty(text)} style={styles.input}  placeholder="e.g. MDI"/>
                                </View>
                                <View style={styles.flex_input}>
                                    <Text style={styles.label}>Building</Text>
                                    <TextInput keyboardType="number-pad"  onChangeText={text=>setBuilding(text)}  style={styles.input}  placeholder="e.g. 2"/>
                                </View>
                                <View style={styles.flex_input}>
                                    <Text style={styles.label}>Room No.</Text>
                                    <TextInput keyboardType="number-pad" onChangeText={text=>setRoom(text)}  style={styles.input}  placeholder="e.g. 901"/>
                                </View>
                                <View style={[styles.flex_input,{ marginTop:hp(1)}]}>
                                    <Text style={styles.label}>Start Time</Text>
                                    <TouchableOpacity  title="Show Time Picker" onCancel={hideTimeStartPicker} onPress={showTimeStartPicker}>
                                        <Text style={{ paddingHorizontal:wp(11), padding:1,marginRight:wp(3), borderColor:'#141414',borderWidth: 1, borderRadius:wp(10)}}>{selectedStartTime ? selectedStartTime : "Time"}</Text>
                                    </TouchableOpacity> 
                                    <DateTimePickerModal
                                        isVisible={isTimeStartPickerVisible}
                                        mode="time"
                                        display="spinner"
                                        positiveButton={{label: 'OK', textColor: 'green'}}
                                        onConfirm={handleTimeStartConfirm}
                                        onCancel={hideTimeStartPicker}
                                    />
                                </View>
                                <View style={[styles.flex_input,{ marginTop:hp(1)}]}>
                                    <Text style={styles.label}>End Time</Text>
                                    <TouchableOpacity  title="Show Time Picker" onCancel={hideTimeEndPicker} onPress={showTimeEndPicker}>
                                        <Text style={{ paddingHorizontal:wp(11), padding:1,marginRight:wp(3), borderColor:'#141414',borderWidth: 1, borderRadius:wp(10)}}>{selectedEndTime ? selectedEndTime : "Time"}</Text>
                                    </TouchableOpacity> 
                                    <DateTimePickerModal
                                        isVisible={isTimeEndPickerVisible}
                                        mode="time"
                                        display="spinner"
                                        positiveButton={{label: 'OK', textColor: 'green'}}
                                        onConfirm={handleTimeEndConfirm}
                                        onCancel={hideTimeEndPicker}
                                    
                                    />
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>
            </View>
        </SafeAreaView>
        );
}

export default Routine

const styles = StyleSheet.create({
        container: {
        flex: 1,
        paddingVertical: 24,
        backgroundColor:"#FDFDFD"
        },
        header: {
        paddingHorizontal: 16,
        },
        title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1d1d1d',
        marginBottom: 12,
        },
        picker: {
        flex: 1,
        maxHeight: 74,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        },
        subtitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#999999',
        marginBottom: 12,
        },
        footer: {
        marginTop: 'auto',
        paddingHorizontal: 16,
        },
        /** Item */
        item: {
        flex: 1,
        height: 50,
        marginHorizontal: 4,
        paddingVertical: 6,
        paddingHorizontal: 4,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#e3e3e3',
        flexDirection: 'column',
        alignItems: 'center',
        },

        itemRow: {
        width: width,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginHorizontal: -4,
        },
        itemWeekday: {
        fontSize: 13,
        fontWeight: '500',
        color: '#737373',
        marginBottom: 4,
        },
        itemDate: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111',
        },
        /** Button */
        btn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderWidth: 1,
            backgroundColor: '#007aff',
            borderColor: '#007aff',
        },
        btnText: {
            fontSize: 18,
            lineHeight: 26,
            fontWeight: '600',
            color: '#fff',
        },
        input:{
            height: hp(4),
            width: wp(40),
            margin: wp(2),
            borderWidth: 1,
            borderRadius: 20,
            padding: wp(1),
            paddingLeft:wp(0),
            textAlign: 'center',
            
        },
        flex_input:{
            flexDirection:"row",alignItems:"center",justifyContent:"space-between"
        },
        label:{
            marginRight:wp(3),
            marginLeft:wp(3),
            fontWeight:'500',
        },

        text:{
            width:wp(20),
            color: 'white',
            fontWeight:'500',
            

        }

    });