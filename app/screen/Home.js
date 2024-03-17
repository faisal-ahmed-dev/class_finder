import {   RefreshControl,StyleSheet, Text, View ,ScrollView} from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
import  { useState, useEffect } from 'react';
import db from '../../api/src/model/db';
import { SafeAreaView } from 'react-native-safe-area-context';


const Home = () => {
    const [refreshing, setRefreshing] = React.useState(false);
    const [name,setName]=useState(false);

   const TodayDate= moment().format('DD-MM-YYYY');
   const [TodayCourseItems,setTodayCourseItems]=useState([{courseCode:""},{building:""}]);

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
        tx.executeSql(`SELECT * FROM class where selectedDate='${TodayDate}' `, null,
            (txObj, resultSet) => setTodayCourseItems(resultSet.rows._array),
            (txObj, error) => console.log(error)
        );
    });


    db.transaction(tx => {
        tx.executeSql(`SELECT user FROM class_user`, null,
            (txObj, resultSet) => {
              if (resultSet.rows.length > 0) {
                const firstRow = resultSet.rows.item(0);
                const { user } = firstRow;
                setName(user);
            }
            },
            (txObj, error) => console.log(error)
        );
    });

},[db])

const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);
  
const handleHomeRefresh=()=>{
    db.transaction(tx => {
        tx.executeSql(`SELECT * FROM class where selectedDate='${TodayDate}' `, null,
            (txObj, resultSet) => setTodayCourseItems(resultSet.rows._array),
            (txObj, error) => console.log(error)
        );
    });

    db.transaction(tx => {
        tx.executeSql(`SELECT user FROM class_user`, null,
            (txObj, resultSet) => {
              if (resultSet.rows.length > 0) {
                const firstRow = resultSet.rows.item(0);
                const { user } = firstRow;
                setName(user);
            }
            },
            (txObj, error) => console.log(error)
        );
    });

}


return (
    <SafeAreaView >
        <ScrollView  refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleHomeRefresh} />
        }>
            <View style={{ padding:wp(5),backgroundColor:"#FDFDFD"}}>
                <Text style={styles.welcome}>Hello {(name) ? name : "USER"}</Text>
                <Text style={styles.highlight}>{ TodayCourseItems.length>0 ? (TodayCourseItems.length) :"NO"} classes Today</Text>
                <View style={{alignItems:'center'}}>
                    <Text style={{fontSize:wp(7),fontWeight:700,marginTop:hp(1)}}>Now</Text>
                    <View style={styles.card}>
                        <View style={styles.flex_row}>
                            <Text style={{fontSize:wp(9),color:"white",fontWeight:'700'}}>{
                                TodayCourseItems.length>0 ?
                                (TodayCourseItems[0].courseCode) : "CSE 121"
                                
                                }</Text>
                            <FontAwesome name="bell" size={24} color="white" />
                        </View>
                        <View>
                            <Text style={{color:"white",fontWeight:'700'}} >{ TodayCourseItems.length>0 ? (TodayCourseItems[0].building) : ""}</Text>
                            <View style={styles.flex_row}>
                                <Text style={{color:"white",fontWeight:'700'}}>FC: { TodayCourseItems.length>0 ? (TodayCourseItems[0].faculty) : ""}</Text>
                                <Text style={{color:"white",fontWeight:'700'}}>{ TodayCourseItems.length>0 ? (TodayCourseItems[0].selectedStartTime): "12:00"}-{ TodayCourseItems.length>0 ?(TodayCourseItems[0].selectedEndTime):"12:00"}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{alignItems:'center'}}>
                    <Text style={{fontSize:wp(6),fontWeight:700,marginTop:hp(1)}}>Next</Text>
                    <View style={styles.card_next}>
                        <View style={styles.flex_row}>
                            <Text style={{fontSize:wp(9),color:"#777377"}}>CSE 121</Text>
                            <FontAwesome name="bell" size={24} style={styles.color_777377} />
                        </View>
                        <View>
                            <Text style={styles.color_777377}>Building: 2</Text>
                            <View style={styles.flex_row}>
                                <Text style={styles.color_777377}>FC: MDI</Text>
                                <Text style={styles.color_777377}>12.00-1.00</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View>
                    <Text style={{textAlign:"center",fontSize:wp(5),fontWeight:700,marginTop:hp(1)}}>Todays class</Text>
                </View>
            </View>
            <View>
                {
                    TodayCourseItems.map((courseItem,index) =>{
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
                                </View>

                            )
                            })
                }
            </View>


        </ScrollView>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
    welcome:{
        fontSize: wp(9),
        fontWeight: '700',
        color: '#1d1d1d',
    },  
    color_777377:{
        color:"#777377"
    },
    highlight:{
        fontSize:wp(6),
        color:"#007aff",
        fontWeight:"700"
    },
    flex_row:{
        flexDirection:"row",alignItems:"center",justifyContent:"space-between"
    },
    card: {
        width:wp(90),backgroundColor:"#007aff",padding:wp(3),borderRadius:10,marginTop:hp(1),marginBottom:hp(1) 
    },
    card_next:{
        width:wp(75),backgroundColor: '#B0BCBC',padding:wp(3),borderRadius:10,marginTop:hp(1),marginBottom:hp(1) 
    },
    color_white:{
        color:"white", 
    },
    text:{
        width:wp(20),
        color: 'white',
        fontWeight:'500',
        

    }
})