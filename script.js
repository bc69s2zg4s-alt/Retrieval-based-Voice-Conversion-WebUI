const recordButton = document.getElementById(“recordButton”);
const audioInput = document.getElementById(“audioInput”);

const inputCard = document.getElementById(“inputCard”);
const audioPlayer = document.getElementById(“audioPlayer”);

const fileName = document.getElementById(“fileName”);
const fileSize = document.getElementById(“fileSize”);

const convertButton = document.getElementById(“convertButton”);

const processing = document.getElementById(“processing”);
const resultCard = document.getElementById(“resultCard”);

const resultPlayer = document.getElementById(“resultPlayer”);
const downloadButton = document.getElementById(“downloadButton”);

const recordTime = document.getElementById(“recordTime”);

let mediaRecorder = null;
let audioChunks = [];
let recordingTimer = null;
let recordingSeconds = 0;
let currentAudioURL = null;

// =============================
// ЗАГРУЗКА ФАЙЛА
// =============================

audioInput.addEventListener(“change”, () => {

const file = audioInput.files[0];
if (!file) return;
showAudio(file);

});

// =============================
// ПОКАЗ АУДИО
// =============================

function showAudio(file) {

if (currentAudioURL) {
    URL.revokeObjectURL(currentAudioURL);
}
currentAudioURL = URL.createObjectURL(file);
audioPlayer.src = currentAudioURL;
fileName.textContent = file.name;
fileSize.textContent =
    formatSize(file.size);
inputCard.classList.remove("hidden");
resultCard.classList.add("hidden");
processing.classList.add("hidden");

}

// =============================
// РАЗМЕР ФАЙЛА
// =============================

function formatSize(bytes) {

if (bytes < 1024) {
    return bytes + " B";
}
if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + " KB";
}
return (bytes / 1024 / 1024).toFixed(1) + " MB";

}

// =============================
// ЗАПИСЬ ГОЛОСА
// =============================

recordButton.addEventListener(“click”, async () => {

if (mediaRecorder &&
    mediaRecorder.state === "recording") {
    stopRecording();
    return;
}
try {
    const stream =
        await navigator.mediaDevices.getUserMedia({
            audio: true
        });
    audioChunks = [];
    mediaRecorder =
        new MediaRecorder(stream);
    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
            audioChunks.push(event.data);
        }
    };
    mediaRecorder.onstop = () => {
        const blob = new Blob(
            audioChunks,
            { type: "audio/webm" }
        );
        const file = new File(
            [blob],
            "recording.webm",
            { type: "audio/webm" }
        );
        showAudio(file);
        stream.getTracks().forEach(
            track => track.stop()
        );
    };
    mediaRecorder.start();
    recordingSeconds = 0;
    recordTime.style.display = "block";
    recordButton.classList.add("recording");
    recordButton.innerHTML =
        '<span class="button-icon">■</span> Остановить запись';
    recordingTimer =
        setInterval(updateRecordingTime, 1000);
} catch (error) {
    alert(
        "Не удалось получить доступ к микрофону."
    );
    console.error(error);
}

});

// =============================
// ОСТАНОВКА
// =============================

function stopRecording() {

if (!mediaRecorder) return;
mediaRecorder.stop();
clearInterval(recordingTimer);
recordTime.style.display = "none";
recordButton.classList.remove("recording");
recordButton.innerHTML =
    '<span class="button-icon">●</span> Записать голос';

}

// =============================
// ТАЙМЕР
// =============================

function updateRecordingTime() {

recordingSeconds++;
const minutes =
    Math.floor(recordingSeconds / 60)
        .toString()
        .padStart(2, "0");
const seconds =
    (recordingSeconds % 60)
        .toString()
        .padStart(2, "0");
recordTime.textContent =
    `${minutes}:${seconds}`;

}

// =============================
// ПРЕОБРАЗОВАНИЕ
// =============================

convertButton.addEventListener(“click”, async () => {

processing.classList.remove("hidden");
resultCard.classList.add("hidden");
convertButton.disabled = true;
/*
    ЗДЕСЬ ПОЗЖЕ ПОДКЛЮЧИМ RVC API.
    Сейчас сайт только имитирует обработку,
    чтобы проверить весь интерфейс.
*/
await new Promise(resolve =>
    setTimeout(resolve, 2500)
);
processing.classList.add("hidden");
resultCard.classList.remove("hidden");
/*
    Пока результатом является исходный файл.
    После подключения RVC здесь будет
    настоящий преобразованный голос.
*/
resultPlayer.src = audioPlayer.src;
downloadButton.href = audioPlayer.src;
convertButton.disabled = false;

});