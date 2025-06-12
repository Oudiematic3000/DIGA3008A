let trackArray=[
    {

    trackTitle: "House Track demo",
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
var mobile=window.matchMedia("(max-width: 750px)")


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
        draw();
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
        sideMenu.style.left='-100%';
        isOpen=false;
    }
}
trackSelect.addEventListener('click',toggleSideMenu);


//carousel

let imageArray=[
    {

    path: "images/AntidotesComparison.png",
    index: 0
},
{
    path: "images/i have short hamstrings.png",
    index: 1
},
{
    path: "images/Meatwood Flack comparison.png",
    index: 2
},
{
    path: "images/Nah no worries.png",
    index: 3
},
{
    path: "images/PetroComparison.png",
    index: 4
},
{
    path: "images/sitting on the grass of my lawn.png",
    index: 5
},
{
    path: "images/The in a bit.png",
    index: 6
},
{
    path: "images/Wheeeze.png",
    index: 7
},


];
imageArray.forEach(imgData => {
    const preloadImg = new Image();
    preloadImg.src = imgData.path;
});
const carouselImages = document.querySelector('.carouselImages');
const img=carouselImages.querySelector('img');
const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');

let currentIndex = 0;

function updateCarousel(index){
    img.src=imageArray[index].path;
}

nextButton.addEventListener('click', () => {
    console.log(currentIndex)
  if (currentIndex < 8) {
    currentIndex++;
  updateCarousel(currentIndex)
  }
});

prevButton.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel(currentIndex)
  }
});


//visualiser stuff

const canvas = document.getElementById('visualizerCanvas');
const canvasCtx = canvas.getContext('2d');
const smoothingFactor=0.9;
let animationFrameId;
const audioContext = new AudioContext();
   analyser = audioContext.createAnalyser();
   analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    smoothedDataArray = new Float32Array(bufferLength);
    source=audioContext.createMediaElementSource(track);
    source.connect(analyser).connect(audioContext.destination);
    handleResize();
function applyEMASmoothing() {
            if (!dataArray) return;
            for (let i = 0; i < dataArray.length; i++) {
                smoothedDataArray[i] = (smoothingFactor * dataArray[i]) + ((1 - smoothingFactor) * smoothedDataArray[i]);
            }
        }

        function draw() {
   
            animationFrameId = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            applyEMASmoothing();
            
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

            const bufferLength = analyser.frequencyBinCount;
            const gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height);
            if(mobile.matches){
      
            gradient.addColorStop(1, 'rgba(70, 70, 70, 0.92)');
            }else{
                gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
               gradient.addColorStop(0.6, 'rgba(119, 119, 119, 0.92)');
            gradient.addColorStop(1, 'rgba(119, 119, 119, 0.92)');
            }
           

            canvasCtx.fillStyle = gradient;
            canvasCtx.strokeStyle = 'rgba(238, 242, 255, 0)';
             const dpr = window.devicePixelRatio || 1;
            canvasCtx.lineWidth = 2 * dpr;

            canvasCtx.beginPath();
            const sliceWidth = canvas.width / (bufferLength - 1);
            let y_first = canvas.clientHeight - (smoothedDataArray[0] / 255.0 * canvas.clientHeight);
            canvasCtx.moveTo(0, y_first);

        for (let i = 0; i < bufferLength - 1; i++) {
                const x1 = i * sliceWidth;
                const y1 = canvas.clientHeight - (smoothedDataArray[i] / 255.0 * canvas.clientHeight);
                const x2 = (i + 1) * sliceWidth;
                const y2 = canvas.clientHeight - (smoothedDataArray[i + 1] / 255.0 * canvas.clientHeight);
                const cx = (x1 + x2) / 2;
                canvasCtx.bezierCurveTo(cx, y1, cx, y2, x2, y2);
            }

            canvasCtx.lineTo(canvas.clientWidth, canvas.clientHeight);
            canvasCtx.lineTo(0, canvas.clientHeight);
            canvasCtx.closePath();
            
            canvasCtx.fill();
            canvasCtx.stroke();
        }

          function handleResize() {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            
            canvasCtx.setTransform(1, 0, 0, 1, 0, 0); 
            canvasCtx.scale(dpr, dpr);
        }
        
         window.addEventListener('resize', handleResize);
       let fadeOutDistance = 3000; 
       let fadeInStart = 500;  
        let fadeInEnd = 800;   


        let fadeOutStart = 1700;
        let fadeOutEnd = 1900;   
        if(mobile.matches){
         fadeOutDistance = 750; 
        fadeInStart = 500;  
        fadeInEnd = 750;    


         fadeOutStart = 800; 
         fadeOutEnd = 950;  
        }

const fadeInDuration = fadeInEnd - fadeInStart;
const fadeOutDuration = fadeOutEnd - fadeOutStart;
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;

    if (scrollPosition <= fadeOutDistance) {
        const opacity = 1 - (scrollPosition / fadeOutDistance);
        canvas.style.opacity = opacity;
    } else {
        canvas.style.opacity = 0;
    }

  let opacity = 0; 

    if (scrollPosition >= fadeInStart && scrollPosition <= fadeInEnd) {
       
        const progress = (scrollPosition - fadeInStart) / fadeInDuration;
        opacity = progress;
        
    } else if (scrollPosition > fadeInEnd && scrollPosition < fadeOutStart) {
       
        opacity = 1;

    } else if (scrollPosition >= fadeOutStart && scrollPosition <= fadeOutEnd) {
        
        const progress = (scrollPosition - fadeOutStart) / fadeOutDuration;
        
        opacity = 1 - progress;
    }
    
    prevButton.style.opacity = Math.min(1, Math.max(0, opacity));
    nextButton.style.opacity = Math.min(1, Math.max(0, opacity));
});



async function getMyAlbumRecommendation() {
    const apiKey = 'a8836b7fe2fa7b1f83347b5537067d7d';
    const myUsername = 'Oudiematic3000';
    const period = '12month';
    const limit = 150;

    const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${myUsername}&api_key=${apiKey}&period=${period}&limit=${limit}&format=json`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const albums = data.topalbums.album;
        const randomIndex = Math.floor(Math.random() * albums.length);
        const recommendedAlbum = albums[randomIndex];

        const albumArtElement = document.querySelector('.APIImage');
        albumArtElement.src = recommendedAlbum.image[3]['#text'];

        const albumTitleElement = document.querySelector('.APITitle');
        albumTitleElement.innerHTML = recommendedAlbum.name;

        const albumArtistElement = document.querySelector('.APIArtist');
        albumArtistElement.innerHTML = recommendedAlbum.artist.name;

        const descriptionElement = document.querySelector('.APIDescription');
         const genreElement = document.querySelector('.APIGenres');
        getAlbumSummary(recommendedAlbum.artist.name,recommendedAlbum.name).then(summary=>{
            descriptionElement.innerHTML=summary;
        })

         getAlbumGenres(recommendedAlbum.artist.name, recommendedAlbum.name)
             .then(description => {
                genreElement.innerHTML = description;
           });

    } catch (error) {
        console.error("Error fetching data from Last.fm:", error);
    }
}
async function getAlbumSummary(artist, album) {
    album=album.replace(/\s*\([^)]*\)\s*$/, '').trim();
    const apiKey = 'a8836b7fe2fa7b1f83347b5537067d7d'; // replace with your Last.fm key
    const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${apiKey}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&format=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.album && data.album.wiki && data.album.wiki.summary) {
            // Remove trailing "Read more" links if present
            return data.album.wiki.summary.replace(/<a.*<\/a>/, '').trim();
        } else {
            return "No summary found for this album.";
        }
    } catch (err) {
        console.error("Error fetching album summary from Last.fm:", err);
        return "Could not fetch album summary.";
    }
}

async function getAlbumGenres(artistName, albumName) {
    const discogsKey = 'CvzkzBrUnUZdluvTQDGl'; 
    const discogsSecret = 'MbRYhybzioaGAjXWOwHcIPvOMWVHpAaZ'; 

     albumName=albumName.replace(/\s*\([^)]*\)\s*$/, '').trim();
    const encodedArtist = encodeURIComponent(artistName);
    const encodedAlbum = encodeURIComponent(albumName);

      const searchUrl = `https://api.discogs.com/database/search?release_title=${encodedAlbum}&artist=${encodedArtist}&type=master&key=${discogsKey}&secret=${discogsSecret}`;

    const headers = {
        'User-Agent': 'ArielOudmayerPortfolio/1.0 +https://oudiematic3000.github.io/DIGA3008A/' 
    };

    try {
        let response = await fetch(searchUrl, { headers });
        let data = await response.json();
        await delay(1000);
        const masterResult = data.results.find(r => r.master_id);
        if (!masterResult) {
            return "No master release found for this album on Discogs.";
        }

        const masterId = masterResult.master_id;
        const masterUrl = `https://api.discogs.com/masters/${masterId}`;

        response = await fetch(masterUrl, { headers });
        data = await response.json();

        if (Array.isArray(data.genres) && data.genres.length > 0) {
            return data.genres; 
        } else {
            return "No genre information found for this album.";
        }

    } catch (error) {
        console.error("Error fetching data from Discogs:", error);
        return "Could not load genre information from Discogs.";
    }
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

getMyAlbumRecommendation();