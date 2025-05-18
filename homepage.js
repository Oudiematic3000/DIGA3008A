//load button
const loadButton=document.getElementById("loadButton");
const loadScreen=document.querySelector('.loadScreen');

const slider = document.getElementById('fader');
slider.value=1;
slider.style.opacity=0;
const bitb = document.querySelector('.bringInTheBass');
bitb.style.opacity=0;

loadButton.addEventListener('click',()=>{
  loadScreen.style.opacity=0;
  loadScreen.style.zIndex=-30;

  slider.style.opacity='100%';
  bitb.style.opacity='100%';
})

//prevent scroll
const isInternalReferrer = document.referrer.includes(window.location.hostname);
if(!isInternalReferrer){
window.scrollTo(0, 0);
document.body.style.overflow='hidden';
}else{
  loadScreen.style.opacity=0;
  loadScreen.style.zIndex=-30;
}
let hasSlid=false;


//Slider Fade in


const introduction = document.querySelector('.introduction');
introduction.style.opacity=0;
introduction.style.bottom=0+'%';


//Slider Audio
let gainBass, gainMelody;
let lastGain=0;
var muted = false; 
const audioContext = new AudioContext();
const melodySource = audioContext.createBufferSource();
const bassSource = audioContext.createBufferSource();

async function audioSetup() {
gainBass = audioContext.createGain();
gainBass.gain.value = 0;

gainMelody = audioContext.createGain();
gainMelody.gain.value = 1;
const melodyBuffer = await fetch('audio/VoyagerMelody.mp3').then(r => r.arrayBuffer()).then(d => audioContext.decodeAudioData(d));
const bassBuffer = await fetch('audio/VoyagerBass.mp3').then(r => r.arrayBuffer()).then(d => audioContext.decodeAudioData(d));

melodySource.buffer = melodyBuffer;
melodySource.connect(gainMelody).connect(audioContext.destination);

bassSource.buffer = bassBuffer;
bassSource.connect(gainBass).connect(audioContext.destination);

const startTime = audioContext.currentTime + 0.1;
melodySource.start(startTime);
melodySource.loop=true;
bassSource.start(startTime);
bassSource.loop=true;
}

window.addEventListener('pointerdown', () => {
  audioSetup();
}, { once: true });

//Slider Event
slider.addEventListener('input', ()=>{

        const value = parseFloat(slider.value);
        bitb.style.transition="none";
        bitb.style.opacity=value;
        introduction.style.opacity=1-value;
        introduction.style.bottom=(1-value)*35+'vh';
        if(!muted) gainBass.gain.value=1-value;
        lastGain=1-value;

        if(!hasSlid && value===0){
          document.body.style.overflow='auto';
          hasSlid=true;
        }

});

//Mute button
const muteButton=document.getElementById("muteButton");
muteButton.addEventListener('click', ()=>{
if(!muted){ 
  gainBass.gain.value=0;
  gainMelody.gain.value=0;
  muted=true;
    muteButton.style.backgroundImage='url("../images/MuteSpeaker.png")'; 
}else{ 
  gainBass.gain.value=lastGain;
  gainMelody.gain.value=1;
  muted=false;
  
    muteButton.style.backgroundImage='url("../images/OnSpeaker.png")'; 

}

});

