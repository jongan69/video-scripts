import whisper_timestamped as whisper
import json

# Load the audio file
audio = whisper.load_audio("../../public/speech.mp3")

# Load the Whisper model
model = whisper.load_model("tiny", device="cpu")

# Transcribe the audio with the specified language
result = whisper.transcribe(model, audio, language="en")

def find_segment_silences(segments):
    silences = []
    last_end_time = segments[0]['end'] if segments else 0  # Start with the end of the first segment

    for segment in segments[1:]:  # Start from the second segment
        current_start_time = segment['start']
        # If there's a gap between the end of the last segment and the start of the current one
        if current_start_time - last_end_time > 0:
            silences.append({
                'start': last_end_time,
                'end': current_start_time
            })
        last_end_time = segment['end']  # Update the end time for the next iteration

    return silences

# Update the result dictionary with silences between segments
result['silences'] = find_segment_silences(result.get('segments', []))

# Print the result with the added silence information
# print(json.dumps(result, indent=2, ensure_ascii=False))

output_file_path = '../../public/speechInfo.json'

# Write the 'result' dictionary to a JSON file
with open(output_file_path, 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"Data saved to {output_file_path}")