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

    echo "record $target" >"$modeFile"
    gpu-screen-recorder -w "$target" -f 60 -a "$(pactl get-default-sink).monitor" -o "$outputPath" &

    echo "Recording started. Output will be saved to $outputPath"
}

pauseRecording() {
    if ! checkRecording; then
        echo "No recording is in progress."
        exit 1
    fi

    if grep -q record "$modeFile"; then
        sed -i "s/record/pause/" "$modeFile"
        # notify-send "Recording paused" "Your recording has been paused." \
        #     -i video-x-generic \
        #     -a "Screen Recorder" \
        #     -t 5000 \
        #     -u normal
    else
        sed -i "s/pause/record/" "$modeFile"
        # notify-send "Recording resumed" "Your recording has been resumed." \
        #     -i video-x-generic \
        #     -a "Screen Recorder" \
        #     -t 5000 \
        #     -u normal
    fi

    pkill -SIGUSR2 -f gpu-screen-recorder

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

    echo "replay $target" >"$modeFile"
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

    local mode=$(cat "$modeFile")
    rm "$modeFile"

    pkill -f gpu-screen-recorder

    if echo "$mode" | grep -q record; then
        recentFile=$(ls -t "$outputDir"/recording_*.mkv | head -n 1)
        notify-send "Recording stopped" "Your recording has been saved." \
            -i video-x-generic \
            -a "Screen Recorder" \
            -t 8000 \
            -u normal \
            --action="scriptAction:-xdg-open $outputDir=Directory" \
            --action="scriptAction:-xdg-open $recentFile=Play"
    else
        notify-send "Replaying stopped" "Background service for saving a replay buffer has stopped." \
            -i video-x-generic \
            -a "Screen Recorder" \
            -t 8000 \
            -u normal
    fi
}

case "$1" in
start)
    startRecording "$@"
    ;;
pause)
    pauseRecording
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
        cat "$modeFile"
    else
        echo "disabled"
    fi
    ;;
*)
    echo "Usage: $0 {start/replay [screen_name]|pasue|save|stop|status}"
    exit 1
    ;;
esac
