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
trackSelect.addEventListener('click', (e) => {
    e.stopPropagation(); 
    toggleSideMenu();
});

sideMenu.addEventListener('click', (e) => {
    e.stopPropagation(); 
});

window.addEventListener('click', () => {
    if (isOpen) {
        toggleSideMenu();
    }
});

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
 function setButtonOpacity() {
    const carouselRect = carouselImages.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const visibleTop = Math.max(0, carouselRect.top);
    const visibleBottom = Math.min(windowHeight, carouselRect.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const totalHeight = carouselRect.height;

    const visibilityRatio = visibleHeight / totalHeight;

    
    let opacity = 0;
    if (visibilityRatio >= 0.2 && visibilityRatio <= 1) {
        opacity = Math.min(1, (visibilityRatio - 0.2) / 0.3); 
    } else if (visibilityRatio > 0.5) {
        opacity = 1;
    } else if (visibilityRatio < 0.1) {
        opacity = 0;
    }

    prevButton.style.opacity = opacity;
    nextButton.style.opacity = opacity;

  
    const scrollPosition = window.scrollY;
    const fadeOutDistance = mobile.matches ? 750 : 3000;
    if (scrollPosition <= fadeOutDistance) {
        canvas.style.opacity = 1 - (scrollPosition / fadeOutDistance);
    } else {
        canvas.style.opacity = 0;
    }
}
window.addEventListener('scroll', setButtonOpacity);
window.addEventListener('resize', setButtonOpacity); 
setButtonOpacity();

async function getMyAlbumRecommendation() {
    const apiKey = 'a8836b7fe2fa7b1f83347b5537067d7d';
    const myUsername = 'Oudiematic3000';
    const period = '12months';
    const limit = 175;

    const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${myUsername}&api_key=${apiKey}&period=${period}&limit=${limit}&format=json`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const albums = data.topalbums.album;
        const randomIndex = Math.floor(Math.random() * albums.length);
        const recommendedAlbum = albums[randomIndex];
        let summaryText;
        let genreText;
        const descriptionElement = document.querySelector('.APIDescription');
         const genreElement = document.querySelector('.APIGenres');
         await  getGenresFromWikipedia(recommendedAlbum.name, recommendedAlbum.artist.name).then(genres=>{
             genreText = genres;
        });
       await getAlbumSummary(recommendedAlbum.artist.name,recommendedAlbum.name).then(summary=>{
            summaryText=summary;
        });
      
         const albumArtElement = document.querySelector('.APIImage');
        albumArtElement.src = recommendedAlbum.image[3]['#text'];

        const albumTitleElement = document.querySelector('.APITitle');
        albumTitleElement.innerHTML = recommendedAlbum.name;

        const albumArtistElement = document.querySelector('.APIArtist');
        albumArtistElement.innerHTML = recommendedAlbum.artist.name;
        genreElement.innerHTML=genreText;
        descriptionElement.innerHTML=summaryText;
   

    } catch (error) {
        console.error("Error fetching data from Last.fm:", error);
    }
}
async function getAlbumSummary(artist, album) {
    album=album.replace(/\s*\([^)]*\)\s*$/, '').trim();
    const apiKey = 'a8836b7fe2fa7b1f83347b5537067d7d'; 
    const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${apiKey}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&format=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.album && data.album.wiki && data.album.wiki.summary) {
            let output=data.album.wiki.summary.replace(/<a.*<\/a>/, '').trim();
            return output.trim().replace(/[\s.]+$/, "") + "…";
        } else {
            return await getWikipediaIntro(album, artist);
        }
    } catch (err) {
        console.error("Error fetching album summary from Last.fm:", err);
             return await getWikipediaIntro(album, artist);
    }
}
async function getWikipediaIntro(title, artist) {
    const originalVariations = [
        title,
        `${title} (album)`,
        `${title} (${artist} album)`
    ];

    // Normalize the title
    const normalizedTitle = await getNormalizedWikipediaTitle(title);

    const normalizedVariations = normalizedTitle
        ? [
            normalizedTitle,
            `${normalizedTitle} (album)`,
            `${normalizedTitle} (${artist} album)`
        ]
        : [];

    const allVariations = [...originalVariations, ...normalizedVariations];

    for (const variation of allVariations) {
        const wikiTitle = encodeURIComponent(variation);
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiTitle}`;

        try {
            const res = await fetch(url);
            if (!res.ok) continue;

            const data = await res.json();
            if (data.extract) {
                return data.extract.trim().replace(/[\s.]+$/, "") + "…";
                
            }
        } catch (e) {
            console.warn(`Failed to fetch Wikipedia summary for "${variation}"`);
        }
    }

    return "";
}

async function getGenresFromWikipedia(title, artist = "") {
    title = title.replace(/\s*\([^)]*\)\s*$/, '').trim();

    // Normalize title for second group of fallbacks
    const normalizedTitle = await getNormalizedWikipediaTitle(title);

    const baseTitles = [title];
    if (normalizedTitle && normalizedTitle !== title) {
        baseTitles.push(normalizedTitle);
    }

    const suffixes = [
        "",                   
        " (album)",           
        ` (${artist} album)`   
    ];

    const variations = baseTitles.flatMap(base =>
        suffixes.map(suffix => `${base}${suffix}`)
    );

    for (const queryTitle of variations) {
        const encodedTitle = encodeURIComponent(queryTitle);
        const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodedTitle}&format=json&origin=*`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            const html = data.parse?.text["*"];
            if (!html) throw new Error("No page content.");

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const infobox = doc.querySelector(".infobox");
            if (!infobox) throw new Error("No infobox.");

            const genreRow = [...infobox.querySelectorAll("tr")].find(tr =>
                tr.querySelector('th a[title="Music genre"]')
            );
            if (!genreRow) throw new Error("No genre row.");

            const genreCell = genreRow.querySelector("td.infobox-data.category.hlist");
            if (!genreCell) throw new Error("No genre cell.");

            const genres = [...genreCell.querySelectorAll("a")]
                .map(link => link.textContent.trim())
                .map(text => text.replace(/\[\d+\]/g, "")) // remove [1], [2], etc.
                .filter(Boolean);

            if (genres.length > 0) {
                return genres.join(", ");
            } else {
                throw new Error("Empty genre list.");
            }

        } catch (error) {
            console.warn(`Failed to get genres for "${queryTitle}": ${error.message}`);
            // Try next variation
        }
    }

    return [""];
}

async function getNormalizedWikipediaTitle(title) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&redirects&format=json&origin=*`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to query Wikipedia");

        const data = await res.json();
        const normalized = data.query?.normalized?.[0]?.to || title;
        const redirects = data.query?.redirects?.[0]?.to;

        const finalTitle = redirects || normalized;

        const pageExists = Object.keys(data.query.pages).some(
            key => !data.query.pages[key].missing
        );

        return pageExists ? finalTitle : null;

    } catch (e) {
        console.warn(`Normalization failed for "${title}": ${e.message}`);
        return null;
    }
}


const rerollButton=document.querySelector('.reroll')
rerollButton.addEventListener('click',()=>{
    getMyAlbumRecommendation();
})
getMyAlbumRecommendation();

const toTopButton=document.querySelector('.toTopButton');
toTopButton.addEventListener('click',()=>{
  window.scrollTo(0, 0);
})