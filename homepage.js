//load button
const loadButton=document.getElementById("loadButton");
const loadScreen=document.querySelector('.loadScreen');
const navbar=document.querySelector('.navbar');
const slider = document.getElementById('fader');
slider.value=1;
slider.style.opacity=0;
const bitb = document.querySelector('.bringInTheBass');
bitb.style.opacity=0;

let gainBass, gainMelody;
let lastGain=0;
var muted = false; 
const audioContext = new AudioContext();
gainBass = audioContext.createGain();
gainMelody = audioContext.createGain();
let melodySource;
let bassSource;

const isInternalReferrer = document.referrer.includes(window.location.hostname);

const introduction = document.querySelector('.introduction');
introduction.style.opacity=0;

const muteButton=document.getElementById("muteButton");

var mobile=window.matchMedia("(max-width: 750px)")

loadButton.addEventListener('click',async ()=>{
  const audioReady= await audioSetup();
  if(audioReady){
  loadScreen.style.opacity=0;
  loadScreen.style.zIndex=-30;

  slider.style.opacity='100%';
  bitb.style.opacity='100%';
  }
}, { once: true });

//prevent scroll
 


if(!isInternalReferrer){
window.scrollTo(0, 0);
document.body.style.overflow='hidden';
if(mobile)navbar.style.top='-100%';
}else{
  loadScreen.style.opacity=0;
  loadScreen.style.zIndex=-30;
  introduction.style.opacity=1;
  slider.style.opacity=1;
  slider.value=0;
  gainBass.gain.value=1;
  lastGain=1;
  mute();
}
let hasSlid=false;


//Slider Fade in




//Slider Audio

async function audioSetup() {

  if (melodySource) {
    try { melodySource.stop(); } catch (e) {}
    melodySource.disconnect();
  }
  if (bassSource) {
    try { bassSource.stop(); } catch (e) {}
    bassSource.disconnect();
  }

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
  bassSource.connect(gainBass).connect(audioContext.destination);

  const startTime = audioContext.currentTime + 0.1;
  melodySource.start(startTime);
  bassSource.start(startTime);

  return true;
}




//Slider Event
slider.addEventListener('input', (e)=>{

        if(mobile){
          e.preventDefault();
        }
        const value = parseFloat(slider.value);
        bitb.style.transition="none";
        bitb.style.opacity=value;
        introduction.style.opacity=1-value;
        if(mobile){
          introduction.style.bottom=(1-value)*45+'vh';
        }else{
          introduction.style.bottom=(1-value)*35+'vh';
        }
        
        if(!muted) gainBass.gain.value=1-value;
        lastGain=1-value;

        if(!hasSlid && value===0){
          document.body.style.overflow='auto';
          if(mobile)
          navbar.style.top=0;
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