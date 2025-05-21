let trackArray=[
    {

    trackTitle: "House track demo",
    genres: "Electronic, House",
    path: "audio/HouseTrackDemo.mp3",
    duration: "5:18",
    index: 0
},
{
    trackTitle: "Because demo",
    genres: "Alternative",
    path: "audio/BecauseDemo.mp3",
    duration: "3:29",
    index: 1
},
{
    trackTitle: "Handicam demo",
    genres: "Webcore, Found-Sounds",
    path: "audio/HandicamDemo.mp3",
    duration: "2:32",
    index: 2
},
{
    trackTitle: "Odd Funk demo",
    genres: "Funk",
    path: "audio/OddFunkDemo.mp3",
    duration: "1:50",
    index: 3
},

];

const scrubber = document.getElementById("scrubber");
const playPauseButton = document.getElementById("playPauseButton");
const playlistButton = document.getElementById("playlistButton");
const backwardsButton = document.getElementById("backwardsButton");
const forwardsButton = document.getElementById("forwardsButton");
const trackTitle = document.getElementById("trackTitle");
const trackList = document.getElementById("trackList");
const trackSelect = document.getElementById("trackSelect");
const sideMenu = document.querySelector(".sideMenu");

let track=document.createElement("audio");
let currentTrack = 0;
let isPlaying =false;
function loadTrack(currentTrack){
track.src=trackArray[currentTrack].path;
trackTitle.innerHTML=trackArray[currentTrack].trackTitle;
track.load();
scrubber.value=0;
if(isPlaying){
    track.play();
}
}

loadTrack(currentTrack);
populateSideMenu();
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

function populateSideMenu(){
    trackArray.forEach(element => {
        const li = document.createElement('li');
        li.classList="menuTrackItem";

        const p1 =document.createElement('p');
        p1.classList="menuItemSongTitle";
        p1.innerHTML=element.trackTitle;
        li.appendChild(p1);

        const p2=document.createElement('p');
        p2.classList="menuItemSongDuration";
        p2.innerHTML=element.duration;
        li.appendChild(p2);

        const p3=document.createElement('p');
        p3.classList="menuItemGenres";
        p3.innerHTML=element.genres;
        li.appendChild(p3);

        li.addEventListener('click',()=>{
            currentTrack=element.index;
            loadTrack(currentTrack);
        
        });
        trackList.appendChild(li);
    });
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
let isOpen=false;
function toggleSideMenu(){
 if(!isOpen){
        sideMenu.style.left='0';
        isOpen=true;
    }else{
        sideMenu.style.left='-25%';
        isOpen=false;
    }
}
trackSelect.addEventListener('click',toggleSideMenu);