import './style.css';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import Upscaler from 'upscaler';
import model2x from '@upscalerjs/esrgan-thick/2x';
import model4x from '@upscalerjs/esrgan-thick/4x';

const $ = (s) => document.querySelector(s);
$('#app').innerHTML = `
<header class="topbar"><a class="brand" href="#"><span class="brand-mark">✦</span>PixelUp <b>AI</b></a><span class="top-note"><i></i> Free AI image enhancement</span><a class="github-link" href="https://github.com/patilswap39/Free-Image-Upscale" target="_blank" rel="noreferrer">GitHub ↗</a></header>
<main>
<section class="hero"><div class="eyebrow">✦ AI-POWERED SUPER RESOLUTION</div><h1>Make every pixel<br><span>count.</span></h1><p>Upscale your images with AI. Get sharper details and higher resolution in a few clicks — completely free.</p><div class="trust"><span>✓ No sign-up</span><span>✓ No watermark</span><span>✓ Private processing</span></div></section>
<section class="workspace"><div class="workspace-head"><div><small>YOUR WORKSPACE</small><h2>Image enhancer</h2></div><span class="privacy">⌑ Stays on your device</span></div>
<div id="dropzone" class="dropzone" tabindex="0" role="button"><input id="file" type="file" accept="image/png,image/jpeg,image/webp,image/bmp" hidden><div class="upload-icon">↑</div><h3>Drop your image here</h3><p>or <button id="browse" class="text-button" type="button">browse files</button> from your device</p><div class="hints"><span>JPG</span><span>PNG</span><span>WEBP</span><span>Up to 10 MB</span></div></div>
<div id="editor" class="editor hidden"><div class="preview"><small>ORIGINAL IMAGE</small><img id="original" alt="Original preview"><button id="remove" type="button" aria-label="Remove image">×</button><p id="meta"></p></div><div class="settings"><small>UPSCALE FACTOR</small><div class="scales"><button class="scale active" data-scale="2" type="button"><b>2×</b><span>Double resolution</span></button><button class="scale" data-scale="4" type="button"><b>4×</b><span>Quadruple resolution</span></button></div><p id="dimensions">Output size appears here</p><button id="upscale" class="primary" type="button">✦ Upscale image</button><p class="note">Powered by ESRGAN AI · Runs in your browser</p></div></div>
<div id="progress" class="progress hidden"><div><span id="status">Loading AI model…</span><b id="percent">0%</b></div><div class="track"><i id="bar"></i></div><p>The first run may take longer while the AI model downloads.</p></div>
<div id="result" class="result hidden"><div class="result-head"><div><small>READY TO DOWNLOAD</small><h3>Your enhanced image</h3></div><span class="done">✓ Complete</span></div><div class="comparison"><div><small>ORIGINAL</small><img id="before" alt="Original image"></div><div><small>ENHANCED <b id="factor">2×</b></small><img id="after" alt="Enhanced image"></div></div><div class="result-foot"><span id="result-meta"></span><button id="download" class="primary">↓ Download image</button></div><button id="again" class="again">Upscale another image</button></div>
<div id="error" class="error hidden" role="alert"></div></section>
<section class="how"><small>SIMPLE BY DESIGN</small><h2>Better images in three steps</h2><div class="steps"><article><b>01</b><h3>Upload</h3><p>Choose a JPG, PNG, or WEBP image from your device.</p></article><article><b>02</b><h3>Enhance</h3><p>Select 2× or 4× and let ESRGAN AI do its work.</p></article><article><b>03</b><h3>Download</h3><p>Save your higher-resolution image without a watermark.</p></article></div></section>
</main><footer><a class="brand" href="#">✦ PixelUp <b>AI</b></a><span>Free, private, AI-powered image upscaling.</span><span>Images stay on your device.</span></footer>`;

const fileInput=$('#file'), drop=$('#dropzone'), editor=$('#editor'), progress=$('#progress'), result=$('#result'), error=$('#error');
let file=null, originalUrl=null, resultUrl=null, scale=2, busy=false;
const bytes=n=>n<1048576?Math.round(n/1024)+' KB':(n/1048576).toFixed(2)+' MB';
const loadImage=url=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('Could not open this image.'));im.src=url;});
function showError(message){error.textContent=message;error.classList.remove('hidden');}
function clearError(){error.textContent='';error.classList.add('hidden');}
function clearResult(){if(resultUrl)URL.revokeObjectURL(resultUrl);resultUrl=null;result.classList.add('hidden');}
async function chooseFile(next){
 clearError();clearResult();if(!next)return;
 if(!['image/jpeg','image/png','image/webp','image/bmp'].includes(next.type)){showError('Choose a JPG, PNG, WEBP, or BMP image.');return;}
 if(next.size>10*1024*1024){showError('Image is larger than 10 MB. Please choose a smaller image.');return;}
 try{const url=URL.createObjectURL(next),im=await loadImage(url);if(originalUrl)URL.revokeObjectURL(originalUrl);originalUrl=url;file=next;
 $('#original').src=url;$('#meta').textContent=im.naturalWidth+' × '+im.naturalHeight+' px · '+bytes(next.size);
 $('#dimensions').textContent=(im.naturalWidth*scale)+' × '+(im.naturalHeight*scale)+' px output';
 drop.classList.add('compact');drop.querySelector('h3').textContent=next.name;drop.querySelector('p').textContent='Image loaded successfully';editor.classList.remove('hidden');
 }catch(e){showError(e.message);}
}
$('#browse').addEventListener('click',()=>fileInput.click());
drop.addEventListener('click',e=>{if(!e.target.closest('button'))fileInput.click();});
drop.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fileInput.click();}});
fileInput.addEventListener('change',e=>chooseFile(e.target.files?.[0]));
drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('dragging');});
drop.addEventListener('dragleave',()=>drop.classList.remove('dragging'));
drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('dragging');chooseFile(e.dataTransfer.files?.[0]);});
document.querySelectorAll('.scale').forEach(btn=>btn.addEventListener('click',()=>{scale=Number(btn.dataset.scale);document.querySelectorAll('.scale').forEach(b=>b.classList.toggle('active',b===btn));if(file){const im=$('#original');$('#dimensions').textContent=(im.naturalWidth*scale)+' × '+(im.naturalHeight*scale)+' px output';}}));
$('#remove').addEventListener('click',()=>{if(busy)return;file=null;fileInput.value='';if(originalUrl)URL.revokeObjectURL(originalUrl);originalUrl=null;editor.classList.add('hidden');drop.classList.remove('compact');drop.querySelector('h3').textContent='Drop your image here';drop.querySelector('p').innerHTML='or <button id="browse" class="text-button" type="button">browse files</button> from your device';$('#browse').addEventListener('click',()=>fileInput.click());clearResult();clearError();});
$('#again').addEventListener('click',()=>{clearResult();editor.classList.remove('hidden');});
$('#download').addEventListener('click',()=>{if(!resultUrl)return;const a=document.createElement('a');a.href=resultUrl;a.download=(file?.name||'image').replace(/\.[^.]+$/,'')+'-pixelup-'+scale+'x.png';a.click();});
$('#upscale').addEventListener('click',async()=>{
 if(!file||busy)return;busy=true;clearError();clearResult();$('#upscale').disabled=true;progress.classList.remove('hidden');$('#status').textContent='Loading AI engine…';$('#percent').textContent='0%';$('#bar').style.width='0%';
 let upscaler;
 try{
  await tf.setBackend('webgl');await tf.ready();
  upscaler=new Upscaler({model:scale===2?model2x:model4x});
  $('#status').textContent='Upscaling image '+scale+'×…';
  const input=await loadImage(originalUrl);
  const output=await upscaler.upscale(input,{patchSize:64,padding:4,awaitNextFrame:true,progress:p=>{const v=Math.max(0,Math.min(99,Math.round(p*100)));$('#percent').textContent=v+'%';$('#bar').style.width=v+'%';}});
  const blob=await (await fetch(output)).blob();resultUrl=URL.createObjectURL(blob);const enhanced=await loadImage(resultUrl);
  $('#before').src=originalUrl;$('#after').src=resultUrl;$('#factor').textContent=scale+'×';$('#result-meta').textContent=enhanced.naturalWidth+' × '+enhanced.naturalHeight+' px · '+bytes(blob.size);
  $('#percent').textContent='100%';$('#bar').style.width='100%';$('#status').textContent='Enhancement complete';
  await new Promise(r=>setTimeout(r,300));progress.classList.add('hidden');editor.classList.add('hidden');result.classList.remove('hidden');result.scrollIntoView({behavior:'smooth',block:'nearest'});
 }catch(e){console.error(e);progress.classList.add('hidden');showError((e?.message||'Could not upscale this image.')+' Try a smaller image and make sure WebGL is enabled.');}
 finally{upscaler?.dispose?.();busy=false;$('#upscale').disabled=false;}
});
(async()=>{try{await tf.setBackend('webgl');await tf.ready();}catch(e){console.warn('WebGL is not available yet.',e);}})();