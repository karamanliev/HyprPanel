#!/usr/bin/env bash

outputDir="$HOME/Videos/Recordings"
replayDir="$HOME/Videos/Replays"
modeFile="/tmp/gpu_recording_mode"

checkRecording() {
    if pgrep -f "gpu-screen-recorder" >/dev/null; then
        return 0
    else
        return 1
    fi
}

startRecording() {
    if checkRecording; then
        echo "A recording is already in progress."
        exit 1
    fi

    target="$2"

    outputFile="recording_$(date +%Y-%m-%d_%H-%M-%S).mkv"
    outputPath="$outputDir/$outputFile"
    mkdir -p "$outputDir"

    if [ -z "$target" ]; then
        echo "Usage: $0 start screen [screen_name]"
        exit 1
    fi

    echo "record" >"$modeFile"
    gpu-screen-recorder -w "$target" -f 60 -a "$(pactl get-default-sink).monitor" -o "$outputPath" &

    echo "Recording started. Output will be saved to $outputPath"
}

startReplaying() {
    if checkRecording; then
        echo "A replay is already in progress."
        exit 1
    fi

    target="$2"

    outputPath="$replayDir"
    mkdir -p "$replayDir"

    if [ -z "$target" ]; then
        echo "Usage: $0 start screen [screen_name]"
        exit 1
    fi

    echo "replay" >"$modeFile"
    gpu-screen-recorder -w "$target" -f 60 -a "$(pactl get-default-sink).monitor|$(pactl get-default-source)" -c mkv -r 45 -o "$outputPath" &

    echo "Replay started. Output will be saved to $outputPath"
}

saveReplay() {
    if ! checkRecording; then
        echo "No waiting for replay is in progress."
        exit 1
    fi

    pkill -SIGUSR1 -f gpu-screen-recorder
    recentFile=$(ls -t "$replayDir"/Replay_*.mkv | head -n 1)
    notify-send "Replay saved" "Your last 45 seconds has been saved." \
        -i video-x-generic \
        -a "Screen Recorder" \
        -t 10000 \
        -u normal \
        --action="scriptAction:-xdg-open $replayDir=Directory" \
        --action="scriptAction:-xdg-open $recentFile=Play"
}

stopRecording() {
    if ! checkRecording; then
        echo "No recording is in progress."
        exit 1
    fi

    pkill -f gpu-screen-recorder
    if [ "$(cat "$modeFile")" = "record" ]; then
        recentFile=$(ls -t "$outputDir"/recording_*.mkv | head -n 1)
        notify-send "Recording stopped" "Your recording has been saved." \
            -i video-x-generic \
            -a "Screen Recorder" \
            -t 10000 \
            -u normal \
            --action="scriptAction:-xdg-open $outputDir=Directory" \
            --action="scriptAction:-xdg-open $recentFile=Play"
    else
        notify-send "Replaying stopped" "Background waiting for to save a replay has stopped." \
            -i video-x-generic \
            -a "Screen Recorder" \
            -t 10000 \
            -u normal
    fi

    echo "" >"$modeFile"
}

case "$1" in
start)
    startRecording "$@"
    ;;
replay)
    startReplaying "$@"
    ;;
save)
    saveReplay
    ;;
stop)
    stopRecording
    ;;
status)
    if checkRecording; then
        if [ "$(cat "$modeFile")" = "record" ]; then
            echo "record"
        else
            echo "replay"
        fi
    else
        echo "disabled"
    fi
    ;;
*)
    echo "Usage: $0 {start/replay [screen_name]|save|stop|status}"
    exit 1
    ;;
esac
