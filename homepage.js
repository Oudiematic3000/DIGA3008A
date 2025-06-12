//load button
const loadButton=document.getElementById("loadButton");
const loadScreen=document.querySelector('.loadScreen');
const navbar=document.querySelector('.navbar');
const slider = document.getElementById('fader');
const canvas = document.getElementById('visualizerCanvas');
const canvasCtx = canvas.getContext('2d');
const smoothingFactor=0.025;
let animationFrameId;
slider.value=1;
slider.style.opacity=0;
const bitb = document.querySelector('.bringInTheBass');
bitb.style.opacity=0;

let gainBass, gainMelody;
let lastGain=0;
var muted = false; 
const audioContext = new AudioContext();
   analyser = audioContext.createAnalyser();
   analyser.fftSize = 32;
    const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
            smoothedDataArray = new Float32Array(bufferLength);
gainBass = audioContext.createGain();
gainMelody = audioContext.createGain();
let melodySource;
let bassSource;
var audioIsSet=false;
const isInternalReferrer = document.referrer.includes(window.location.hostname);

const introduction = document.querySelector('.introduction');
introduction.style.opacity=0;

const muteButton=document.getElementById("muteButton");

var mobile=window.matchMedia("(max-width: 750px)")


loadButton.addEventListener('click',async ()=>{
  const audioReady= await audioSetup();
  if(audioReady && !audioIsSet){
  loadScreen.style.opacity=0;
  loadScreen.style.zIndex=-30;
    draw();
  slider.style.opacity='100%';
  bitb.style.opacity='100%';
  audioIsSet=true;
  }
}, { once: true });

//prevent scroll
 
handleResize(); 

if(!isInternalReferrer){
window.scrollTo(0, 0);
document.body.style.overflow='hidden';
if(mobile.matches)navbar.style.top='-100%';
}else{
  loadScreen.style.opacity=0;
  loadScreen.style.zIndex=-30;
  introduction.style.opacity=1;
  slider.style.opacity=1;
  slider.value=0;
  gainBass.gain.value=1;
  lastGain=1;
  mute();
  draw();
}
let hasSlid=false;


//Slider Fade in




//Slider Audio

async function audioSetup() {

  gainBass.gain.value = 0;
  if (!isInternalReferrer) gainMelody.gain.value = 1;

  const melodyBuffer = await fetch('audio/VoyagerMelody.mp3')
    .then(r => r.arrayBuffer())
    .then(d => audioContext.decodeAudioData(d));

  const bassBuffer = await fetch('audio/VoyagerBass.mp3')
    .then(r => r.arrayBuffer())
    .then(d => audioContext.decodeAudioData(d));

    

  melodySource = audioContext.createBufferSource();
  melodySource.buffer = melodyBuffer;
  melodySource.loop = true;
  melodySource.connect(gainMelody).connect(audioContext.destination);

  bassSource = audioContext.createBufferSource();
  bassSource.buffer = bassBuffer;
  bassSource.loop = true;
  bassSource.connect(gainBass).connect(analyser).connect(audioContext.destination);

  const startTime = audioContext.currentTime + 0.1;
  melodySource.start(startTime);
  bassSource.start(startTime);

  return true;
}




//Slider Event
slider.addEventListener('input', (e)=>{

        if(mobile.matches){
          e.preventDefault();
        }
        const value = parseFloat(slider.value);
        bitb.style.transition="none";
        bitb.style.opacity=value;
        introduction.style.opacity=1-value;
        canvas.style.bottom=-(value*100)+'%'
        canvas.style.opacity=1-(value);
        if(mobile.matches){
          console.log("grrr");
          introduction.style.bottom=(1-value)*45+'vh';
        }else{
          introduction.style.bottom=(1-value)*35+'vh';
        }
        
        if(!muted) gainBass.gain.value=1-value;
        lastGain=1-value;

        if(!hasSlid && value===0){
          document.body.style.overflow='auto';
          if(mobile.matches){
          navbar.style.top=0;
       
          }
        hasSlid=true;
        }

});

function mute(){
 gainBass.gain.value=0;
  gainMelody.gain.value=0;
  muted=true;
  muteButton.style.backgroundImage='url("images/MuteSpeaker.png")'; 
}
//Mute button

muteButton.addEventListener('click', ()=>{
if(!muted){ 
 mute();
}else{ 
  if(!audioIsSet){
    audioSetup();
    audioIsSet=true;
  }
  gainBass.gain.value=lastGain;
  gainMelody.gain.value=1;
  muted=false;
  
    muteButton.style.backgroundImage='url("images/OnSpeaker.png")'; 

}

});

//scrolling nav default behaviour overrwite
document.querySelectorAll('.navLink').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault(); 
      const href = this.getAttribute('href');

    if (href === "#") {
    
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const target = document.querySelector(href);
      target?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


//visualiser stuff

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
              gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
               gradient.addColorStop(0.3, 'rgba(90, 90, 90, 0.39)');
            gradient.addColorStop(1, 'rgba(70, 70, 70, 0.92)');
            }else{
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
            gradient.addColorStop(0.75, 'rgba(90, 90, 90, 0.39)');
            gradient.addColorStop(1, 'rgba(70, 70, 70, 0.92)');
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
            
            // >> FIX: Reset the transform matrix before applying the new scale
            // This prevents the cumulative scaling issue.
            canvasCtx.setTransform(1, 0, 0, 1, 0, 0); 
            canvasCtx.scale(dpr, dpr);
        }
        
         window.addEventListener('resize', handleResize);
        