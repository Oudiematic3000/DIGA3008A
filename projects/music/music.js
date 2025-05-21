let trackArray=[
    {

    trackTitle: "House track demo",
    genres: "Electronic, House",
    path: "audio/HouseTrackDemo.mp3"
},
{
    trackTitle: "Because demo",
    genres: "Alternative",
    path: "audio/BecauseDemo.mp3"
},
{
    trackTitle: "Handicam demo",
    genres: "Webcore, Found-Sounds",
    path: "audio/HandicamDemo.mp3"
},
{
    trackTitle: "Odd Funk demo",
    genres: "Funk",
    path: "audio/OddFunkDemo.mp3"
},

];

const audioContext = new AudioContext();
const scrubber = document.getElementById("scrubber");
const playPauseButton = document.getElementById("playPauseButton");
const playlistButton = document.getElementById("playlistButton");
const backwardsButton = document.getElementById("backwardsButton");
const forwardsButton = document.getElementById("forwardsButton");
const genreList = document.getElementById("genreList");
const trackTitle = document.getElementById("trackTitle");

let track=document.createElement("audio");
let currentTrack = 0;
let isPlaying =false;
function loadTrack(currentTrack){
track.src=trackArray[currentTrack].path;
trackTitle.innerHTML=trackArray[currentTrack].trackTitle;
genreList.innerHTML=trackArray[currentTrack].genres;
track.load();
scrubber.value=0;
if(isPlaying){
    track.play();
}
}

loadTrack(currentTrack);

function playTrack(){
    if(!isPlaying){
        track.play();
        isPlaying=true;
        playPauseButton.innerHTML='<i class="fa-solid fa-pause"></i>';
    }else{
        track.pause();
        isPlaying=false;
        playPauseButton.innerHTML='<i class="fa-solid fa-play"></i>';
    }
   
}

playPauseButton.addEventListener('click', playTrack);
track.addEventListener('loadedmetadata', ()=>{

    scrubber.max=track.duration;
})

track.addEventListener('timeupdate', ()=>{
    scrubber.value=track.currentTime;
});

scrubber.addEventListener("input", () => {
    track.currentTime = scrubber.value;
});

forwardsButton.addEventListener('click', ()=>{
    if(currentTrack<trackArray.length-1){
    currentTrack++;
    loadTrack(currentTrack);
    }
});

backwardsButton.addEventListener('click', ()=>{
    if(currentTrack>0)
    currentTrack--;
    loadTrack(currentTrack);
});