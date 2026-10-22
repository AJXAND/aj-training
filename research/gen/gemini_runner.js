// Runs inside a Gemini chat tab: sends each queued prompt, waits for the reply, records whether an image came back.
window.AJQ = async function(queue){
  const st = window.AJQS = {i:0, n:queue.length, log:[], running:true};
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const imgs = () => [...document.querySelectorAll('model-response')].map(r => [...r.querySelectorAll('img')].some(i => i.naturalWidth > 400));
  const busy = () => !!document.querySelector('button[aria-label*="Stop" i]');
  for (const it of queue){
    if (!st.running) break;
    const before = document.querySelectorAll('model-response').length;
    const ed = document.querySelector('rich-textarea .ql-editor');
    ed.focus(); document.execCommand('selectAll', false); document.execCommand('insertText', false, it.p);
    await sleep(600);
    const send = document.querySelector('button[aria-label*="Send" i]');
    if (!send){ st.log.push([it.id, 'nosend']); break; }
    send.click();
    let t = 0;
    while (t < 240){ await sleep(2000); t += 2;
      if (document.querySelectorAll('model-response').length > before && !busy()){
        await sleep(3000); const r = imgs(); if (r[r.length - 1] || t > 30) break; } }
    const r = imgs(); st.log.push([it.id, r[r.length - 1] ? 'img' : 'noimg', document.querySelectorAll('model-response').length]);
    st.i++;
    await sleep(2500);
  }
  st.running = false;
};
