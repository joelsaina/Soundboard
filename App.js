/**
 * File - App.js
 * Author - Joel Saina
 * Credit - Joel Saina, Yuvraj
 **/
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { openDatabase } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { Styles } from './styles/page-styles';


const db = openDatabase('db.db');

export default function App() {
    const [recording, setRecording] = useState(null);
    const [lastRecordingUri, setLastRecordingUri] = useState("");

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS recordings (id INTEGER PRIMARY KEY AUTOINCREMENT, uri TEXT, duration INTEGER, createdAt TEXT);',
                [],
                null,
                (_, err) => console.log('Error creating table', err)
            );
            tx.executeSql(
                'SELECT uri FROM recordings ORDER BY createdAt DESC LIMIT 1;',
                [],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        setLastRecordingUri(rows._array[0].uri);
                    }
                },
                (_, err) => console.log('Error fetching last recording', err)
            );
        });
    }, []);

    const handleRecording = async () => {
        if (recording) {

            await stopRecording();
        } else {
      
            await startRecording();
        }
    };

    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status !== 'granted') {
                alert('Permission to access microphone is required!');
                return;
            }
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const newRecording = new Audio.Recording();
            await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await newRecording.startAsync();
            setRecording(newRecording);
        } catch (err) {
            console.error('Failed to start recording:', err);
        }
    };



    const stopRecording = async () => {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setLastRecordingUri(uri); 
        setRecording(null); 
        saveRecording(uri); 
    };



    const saveRecording = (uri) => {
        const createdAt = new Date().toISOString();
        const duration = 0; 

        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO recordings (uri, duration, createdAt) VALUES (?, ?, ?);',
                [uri, duration, createdAt],
                null,
                (_, err) => console.log('Error saving recording to the database', err)
            );
        });
    };

    const playSound = async (soundPath) => {
        try {
            let source;
            if (typeof soundPath === 'string') {
                source = { uri: soundPath }; 
            } else {
                source = soundPath;
            }
            const { sound } = await Audio.Sound.createAsync(source);
            await sound.setIsLoopingAsync(true);
            await sound.playAsync();
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };

    return (

        <View style={Styles.container}>
            <View style={{ height: 30 }}></View>
            <Text style={Styles.heading}>Soundboard</Text>

            { }
            <View style={Styles.instrumentButtonContainer}>
                <TouchableOpacity
                    style={[Styles.button, { backgroundColor: 'red' }]}
                    onPress={() => playSound(require('./assets/sfx/beats.mp3'))}>
                    <Text style={Styles.buttonText}>Beats</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[Styles.button, { backgroundColor: 'purple' }]}
                    onPress={() => playSound(require('./assets/sfx/guitar.mp3'))}>
                    <Text style={Styles.buttonText}>Guitar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[Styles.button, { backgroundColor: 'orange' }]}
                    onPress={() => playSound(require('./assets/sfx/string.mp3'))}>
                    <Text style={Styles.buttonText}>String</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flexGrow: 0.3 }} />

            <View style={Styles.recordingButtonContainer}>

                <TouchableOpacity
                    style={[Styles.button, { backgroundColor: 'rgb(0, 35, 255)' }]}
                    onPress={handleRecording}>

                    <Text style={Styles.buttonText}>{recording ? "Stop Recording" : "Start Recording"}</Text>
                </TouchableOpacity>

                {lastRecordingUri && (
                    <TouchableOpacity
                        style={[Styles.button, { backgroundColor: 'rgb(255, 0, 63)' }]}

                        onPress={() => playSound(lastRecordingUri)}>
                        <Text style={Styles.buttonText}>Play Recording</Text>

                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

