import { FFmpegKit } from 'ffmpeg-kit-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { Button, Card, Snackbar, Text } from 'react-native-paper';
import Trimmer from 'react-native-trimmer';
import DateTime from '../../lib/DateTime';

const { width } = Dimensions.get('window');
const audioRecorderPlayer = new AudioRecorderPlayer();

const maxTrimDuration = 60; // 60 seconds
const minimumTrimDuration = 1; // 1 second
const scrubInterval = 50; // Scrubber movement speed

const AudioCutterScreen = () => {
  const [audioUri, setAudioUri] = useState(null);
  const [audioName, setAudioName] = useState('');
  const [duration, setDuration] = useState(1);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const [scrubberPosition, setScrubberPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingDuration, setPlayingDuration] = useState(0);
  const [trimmedDuration, setTrimmedDuration] = useState(10);
  const [visible, setVisible] = useState(false);


  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setScrubberPosition((prev) => Math.min(prev + scrubInterval / 1000, endTime));
        setPlayingDuration((prev) => Math.min(prev + scrubInterval / 1000, trimmedDuration));
      }, scrubInterval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, scrubberPosition]);


  const selectAudio = async () => {
    try {
      const result = await DocumentPicker.pickSingle({ type: DocumentPicker.types.audio });
      if (result) {
        let uri = result.uri;
        let filePath = uri;

        if (uri.startsWith('content://')) {
          const destPath = `${RNFS.ExternalStorageDirectoryPath}/${result.name}`;
          await RNFS.copyFile(uri, destPath);
          filePath = destPath;
        }

        setAudioUri(filePath);
        setAudioName(result.name);
        loadAudio(filePath);
      }
    } catch (err) {
      console.log('Error selecting audio:', err);
    }
  };

  const loadAudio = async (path) => {
    try {
      await audioRecorderPlayer.stopPlayer();
      await audioRecorderPlayer.startPlayer(path);
      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.duration > 0) {
          const audioDuration = Math.max(e.duration / 1000, 1);
          setDuration(audioDuration);
          setEndTime(audioDuration);
          setTrimmedDuration(audioDuration);
        }
      });
      await audioRecorderPlayer.stopPlayer(); // Stop playing immediately after fetching duration

    } catch (error) {
      console.log('Error loading audio:', error);
    }
  };

  const handleTrim = async () => {
    if (!audioUri) return;

    const directoryPath = `${RNFS.ExternalStorageDirectoryPath}/SushAudioTrimmer`;
    const trimmedTime = endTime - startTime; // Calculate trimmed duration
    const outputPath = `${directoryPath}/${audioName}-${DateTime.formatDuration(trimmedTime)}-${Date.now()}.mp3`;
    const dirExists = await RNFS.exists(directoryPath);
    if (!dirExists) {
      await RNFS.mkdir(directoryPath);
    }
    const command = `-i "${audioUri}" -ss ${startTime} -to ${endTime} -c copy "${outputPath}"`;

    await FFmpegKit.execute(command)
      .then((res) => {
        setTrimmedDuration(endTime - startTime);
        setVisible(true);
      })
      .catch((err) => {
        console.log('FFmpeg Error:', err);
        Alert.alert('Error', 'Failed to trim audio.');
      });
  };


  const handlePlayPause = async () => {
    console.log('🔹 startTime:', startTime, 'endTime:', endTime);

    try {
      if (isPlaying) {
        await audioRecorderPlayer.pausePlayer();
        setIsPlaying(false);
      } else {
        await audioRecorderPlayer.stopPlayer();
        setIsPlaying(true);

        const startMilliseconds = Math.floor(startTime * 1000);


        await audioRecorderPlayer.startPlayer(audioUri);
        await audioRecorderPlayer.seekToPlayer(startMilliseconds); // Ensure proper seek

        audioRecorderPlayer.removePlayBackListener();

        audioRecorderPlayer.addPlayBackListener(async (e) => {
          const currentPosition = e.currentPosition / 1000;

          console.log('🎵 Playback Position:', currentPosition);

          setPlayingDuration(currentPosition - startTime);
          setScrubberPosition(currentPosition);

          if (currentPosition >= endTime) {
            console.log('⏹ Stopping Playback at:', currentPosition);
            await audioRecorderPlayer.stopPlayer();
            setIsPlaying(false);
            setScrubberPosition(startTime);
            setPlayingDuration(0);
            audioRecorderPlayer.removePlayBackListener();
          }
        });
      }
    } catch (error) {
      console.log('❌ Error playing audio:', error);
    }
  };




  const onHandleChange = ({ leftPosition, rightPosition }) => {
    setStartTime(leftPosition);
    setEndTime(rightPosition);
    setScrubberPosition(leftPosition);
    setTrimmedDuration(rightPosition - leftPosition);
  };

  const resetState = async () => {
    setAudioUri(null);
    setAudioName('');
    setDuration(1);
    setStartTime(0);
    setEndTime(10);
    setScrubberPosition(0);
    setIsPlaying(false);
    setPlayingDuration(0);
    setTrimmedDuration(10);
    setVisible(false);
    await audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#A3D700" />
      <Button mode="outlined" onPress={resetState} style={styles.resetButton}>
        Reset
      </Button>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setVisible(false),
        }}
      >
        🎉 Audio trimmed successfully!
      </Snackbar>
      {!audioUri ? (
        <TouchableOpacity onPress={() => selectAudio()} style={styles.selectButton}>
          <Text style={styles.selectText}>Select Audio</Text>
        </TouchableOpacity>
      ) : (
        <Card style={styles.card}>
          <Text variant="titleLarge" style={styles.title}>Audio Cutter</Text>
          <Text style={styles.audioName}>{audioName}</Text>

          {audioUri && duration > 0 && !isNaN(duration) && (
            <>
              <Trimmer
                source={audioUri}
                height={50}
                width={Math.max(width - 40, 100)}
                onHandleChange={(e) => onHandleChange(e)}
                onScrubbingComplete={(value) => setScrubberPosition(value)}
                totalDuration={Math.max(duration, 1)}
                trimmerLeftHandlePosition={startTime}
                trimmerRightHandlePosition={endTime}
                scrubberPosition={scrubberPosition}
                maxTrimDuration={maxTrimDuration}
                minimumTrimDuration={minimumTrimDuration}
                showTrackerHandle={false}
                scrubberColor="gold"
                tintColor="gold"
                trackBackgroundColor="#1E1E1E"
                trackBorderColor="gold"
                maximumZoomLevel={1}
                zoomMultiplier={1}
                disableScroll={true}
                disablePanGesture={true}
              />
              <Text style={styles.durationText}>Trimmed Duration: {DateTime.formatDuration(trimmedDuration?.toFixed(2))}</Text>
              <Text style={styles.durationText}>Playing Duration: {DateTime.formatDuration(playingDuration?.toFixed(2))}</Text>
            </>
          )}

          <View style={styles.buttonRow}>
            <Button mode="contained" onPress={() => handleTrim()} style={styles.button}>
              Trim Audio
            </Button>
            <Button mode="outlined" onPress={() => handlePlayPause()} style={styles.playButton}>
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
          </View>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  selectButton: {
    padding: 15,
    backgroundColor: 'gold',
    borderRadius: 10,
  },
  selectText: {
    color: '#121212',
    fontSize: 18,
  },
  resetButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    borderColor: 'gold',
    borderWidth: 1,
    backgroundColor: "white"
  },
  card: {
    width: width,
    borderRadius: 15,
    backgroundColor: '#1E1E1E',
  },
  title: {
    textAlign: 'center',
    color: 'gold',
    marginBottom: 10,
  },
  audioName: {
    textAlign: 'center',
    color: '#fff',
    marginBottom: 10,
  },
  durationText: {
    textAlign: 'center',
    color: 'gold',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    padding: 20,

  },
  button: {
    flex: 1,
    marginRight: 10,
    backgroundColor: 'gold',
  },
  playButton: {
    flex: 1,
    borderColor: 'gold',
    backgroundColor: "white"
  },
  exportButton: {
    marginTop: 10,
    backgroundColor: '#ffcc00',
  },
});

export default AudioCutterScreen;
