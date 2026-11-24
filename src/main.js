import './style.css';

const $ = (s) => document.querySelector(s);
$('#app').innerHTML = `
<header class="nav"><a class="logo" href="#"><span class="logo-mark">✦</span> PixelUp <b>Studio</b></a><span class="nav-tag"><i></i> Free · Private · No watermark</span><a class="nav-link" href="https://github.com/patilswap39/Free-Image-Upscale" target="_blank" rel="noreferrer">GitHub ↗</a></header>
<main>
<section class="intro"><div class="eyebrow">THE SIMPLE IMAGE UPSCALER</div><h1>More pixels.<br><span>More possibilities.</span></h1><p>Enlarge photos in seconds with high-quality browser processing. No account, no upload, no watermark.</p></section>
<section class="tool">
 <div class="tool-title"><div><span class="kicker">IMAGE WORKSPACE</span><h2>Upscale your image</h2></div><span class="private">⌑ Your image stays on this device</span></div>
 <div id="drop" class="drop" tabindex="0" role="button" aria-label="Choose an image"><input id="file" type="file" accept="image/jpeg,image/png,image/webp" hidden><div class="upload-symbol">↑</div><h3>Drop an image here</h3><p>or <button id="browse" class="inline-btn" type="button">choose a file</button></p><div class="formats"><span>JPG</span><span>JPEG</span><span>PNG</span><span>WEBP</span><span>Up to 16 MB</span></div></div>
 <div id="editor" class="editor hidden">
  <div class="source-card"><div class="card-label">YOUR IMAGE <button id="change" class="subtle" type="button">Change</button></div><img id="source" alt="Selected original"><div id="source-meta" class="meta"></div></div>
  <div class="controls">
   <div class="control-group"><span class="control-label">UPSCALE SIZE</span><div class="factor"><button class="factor-btn selected" data-factor="2" type="button"><b>2×</b><small>Double size</small></button><button class="factor-btn" data-factor="4" type="button"><b>4×</b><small>Quadruple size</small></button></div></div>
   <div class="control-group"><span class="control-label">SAVE FORMAT</span><div class="format-select"><button class="format-btn selected" data-format="image/png" type="button">PNG</button><button class="format-btn" data-format="image/jpeg" type="button">JPG</button><button class="format-btn" data-format="image/webp" type="button">WEBP</button></div></div>
   <div class="output-info"><span>Output dimensions</span><b id="output-size">—</b></div>
   <button id="run" class="primary" type="button">↑ Upscale image</button>
   <p class="hint">Fast resize runs locally in your browser. No image is uploaded.</p>
  </div>
 </div>
 <div id="progress" class="progress hidden"><div class="progress-line"><span id="progress-label">Preparing image…</span><b id="progress-value">0%</b></div><div class="bar"><i id="bar-fill"></i></div></div>
 <div id="result" class="result hidden">
  <div class="result-top"><div><span class="kicker">READY TO SAVE</span><h3>Your upscaled image</h3></div><span class="success">✓ Done</span></div>
  <div class="compare-wrap"><div class="compare" id="compare"><img id="compare-before" alt="Original"><div class="after-layer" id="after-layer"><img id="compare-after" alt="Upscaled"></div><div class="compare-line" id="compare-line"><span>↔</span></div><span class="tag before-tag">ORIGINAL</span><span class="tag after-tag">UPSCALED</span></div><input id="compare-range" type="range" min="0" max="100" value="50" aria-label="Compare original and upscaled image"></div>
  <div class="result-bottom"><div><b id="final-dimensions"></b><small id="final-size"></small></div><button id="download" class="primary" type="button">↓ Download image</button></div>
  <button id="another" class="again" type="button">Upscale another image</button>
 </div>
 <div id="error" class="error hidden" role="alert"></div>
</section>
<section class="features"><div class="eyebrow">MADE FOR EVERYDAY WORK</div><h2>Everything you need. Nothing in the way.</h2><div class="feature-grid"><article><span>⚡</span><h3>Fast processing</h3><p>Uses your browser's native image engine. No model download or server queue.</p></article><article><span>⌑</span><h3>Private by design</h3><p>Your photo is processed on your device and never sent to a server.</p></article><article><span>↗</span><h3>Ready to download</h3><p>Export as PNG, JPG, or WebP with no watermark.</p></article></div></section>
<p class="fineprint">PixelUp uses high-quality image resampling for fast enlargement. It increases pixel dimensions, but unlike generative AI restoration it does not invent missing photo details.</p>
</main><footer><a class="logo" href="#">✦ PixelUp <b>Studio</b></a><span>Free image upscaling, right in your browser.</span></footer>`;

const fileInput=$('#file'),drop=$('#drop'),editor=$('#editor'),progress=$('#progress'),result=$('#result'),error=$('#error');
let file=null,sourceUrl=null,outputUrl=null,scale=2,format='image/png',busy=false,sourceImage=null,outputBlob=null;
const fmtBytes=n=>n<1024*1024?(n/1024).toFixed(0)+' KB':(n/1024/1024).toFixed(2)+' MB';
const fmtDim=(w,h)=>w.toLocaleString()+' × '+h.toLocaleString()+' px';
function message(s){error.textContent=s;error.classList.remove('hidden');}
function clearMessage(){error.textContent='';error.classList.add('hidden');}
function clearOutput(){if(outputUrl)URL.revokeObjectURL(outputUrl);outputUrl=null;outputBlob=null;result.classList.add('hidden');}
function dimensions(){if(!sourceImage)return;$('#output-size').textContent=fmtDim(sourceImage.naturalWidth*scale,sourceImage.naturalHeight*scale);}
function setFile(next){
 clearMessage();if(!next)return;
 if(!['image/jpeg','image/png','image/webp'].includes(next.type)){message('Please choose a JPG, PNG, or WebP image.');return;}
 if(next.size>16*1024*1024){message('This image is larger than 16 MB. Choose a smaller file.');return;}
 const url=URL.createObjectURL(next),im=new Image();
 im.onload=()=>{if(sourceUrl)URL.revokeObjectURL(sourceUrl);clearOutput();file=next;sourceUrl=url;sourceImage=im;$('#source').src=url;$('#source-meta').textContent=fmtDim(im.naturalWidth,im.naturalHeight)+' · '+fmtBytes(next.size);dimensions();editor.classList.remove('hidden');drop.classList.add('compact');drop.querySelector('h3').textContent=next.name;drop.querySelector('p').textContent='Image selected';};
 im.onerror=()=>{URL.revokeObjectURL(url);message('Could not read this image. Try another file.');};im.src=url;
}
function reset(){if(busy)return;file=null;sourceImage=null;fileInput.value='';if(sourceUrl)URL.revokeObjectURL(sourceUrl);sourceUrl=null;clearOutput();editor.classList.add('hidden');drop.classList.remove('compact');drop.querySelector('h3').textContent='Drop an image here';drop.querySelector('p').innerHTML='or <button id="browse" class="inline-btn" type="button">choose a file</button>';$('#browse').addEventListener('click',()=>fileInput.click());clearMessage();}
$('#browse').addEventListener('click',()=>fileInput.click());drop.addEventListener('click',e=>{if(!e.target.closest('button'))fileInput.click();});drop.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fileInput.click();}});
fileInput.addEventListener('change',e=>setFile(e.target.files?.[0]));drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('dragging');});drop.addEventListener('dragleave',()=>drop.classList.remove('dragging'));drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('dragging');setFile(e.dataTransfer.files?.[0]);});
$('#change').addEventListener('click',()=>fileInput.click());$('#another').addEventListener('click',reset);
document.querySelectorAll('.factor-btn').forEach(b=>b.addEventListener('click',()=>{scale=Number(b.dataset.factor);document.querySelectorAll('.factor-btn').forEach(x=>x.classList.toggle('selected',x===b));dimensions();clearOutput();}));
document.querySelectorAll('.format-btn').forEach(b=>b.addEventListener('click',()=>{format=b.dataset.format;document.querySelectorAll('.format-btn').forEach(x=>x.classList.toggle('selected',x===b));}));
$('#compare-range').addEventListener('input',e=>{const v=e.target.value+'%';$('#after-layer').style.width=v;$('#compare-line').style.left=v;});
$('#run').addEventListener('click',async()=>{
 if(!sourceImage||busy)return;busy=true;clearMessage();clearOutput();$('#run').disabled=true;progress.classList.remove('hidden');$('#progress-label').textContent='Upscaling in your browser…';$('#progress-value').textContent='15%';$('#bar-fill').style.width='15%';
 try{
  await new Promise(requestAnimationFrame);
  const w=sourceImage.naturalWidth*scale,h=sourceImage.naturalHeight*scale;
  if(w*h>64000000)throw new Error('The output would be too large for a browser tab. Please use a smaller image or choose 2×.');
  const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  const ctx=canvas.getContext('2d',{alpha:format!=='image/jpeg'});
  if(!ctx)throw new Error('Your browser could not create an image canvas.');
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.fillStyle='#fff';if(format==='image/jpeg')ctx.fillRect(0,0,w,h);
  ctx.drawImage(sourceImage,0,0,w,h);$('#progress-value').textContent='85%';$('#bar-fill').style.width='85%';
  outputBlob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Could not export this image. Try another format.')),format,0.94));
  outputUrl=URL.createObjectURL(outputBlob);$('#compare-before').src=sourceUrl;$('#compare-after').src=outputUrl;$('#after-layer').style.width='50%';$('#compare-line').style.left='50%';$('#compare-range').value=50;
  $('#final-dimensions').textContent=fmtDim(w,h);$('#final-size').textContent=fmtBytes(outputBlob.size)+' · '+format.split('/')[1].toUpperCase();
  $('#progress-value').textContent='100%';$('#bar-fill').style.width='100%';await new Promise(r=>setTimeout(r,100));progress.classList.add('hidden');editor.classList.add('hidden');result.classList.remove('hidden');result.scrollIntoView({behavior:'smooth',block:'nearest'});
 }catch(e){progress.classList.add('hidden');message(e.message||'Something went wrong while upscaling.');}
 finally{busy=false;$('#run').disabled=false;}
});
$('#download').addEventListener('click',()=>{if(!outputUrl)return;const ext=format.split('/')[1];const a=document.createElement('a');a.href=outputUrl;a.download=(file?.name||'image').replace(/\.[^.]+$/,'')+'-'+scale+'x.'+(ext==='jpeg'?'jpg':ext);a.click();});
