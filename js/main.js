// Optional progressive enhancement: critical career highlights remain visible without JavaScript.
(() => {
  document.documentElement.classList.add('js');
  for (const link of document.querySelectorAll('a[href^="#"]')) {
    link.addEventListener('click', () => { if (document.activeElement === link) link.blur(); });
  }
  const profiles = {
    infosys: {
      kicker:'INFOSYS / NOV 2020 – JUL 2024', title:'From building interfaces to technical delivery',
      parts:[
        {role:'Technology Analyst', date:'Jul 2023 – Jul 2024', text:'Coordinated day-to-day engineering work across eight developers, reviewed implementations, worked through blockers, mentored colleagues, and collaborated with a project manager and stakeholders on Agile delivery.'},
        {role:'Senior Systems Engineer', date:'Jul 2022 – Jul 2023', text:'Built Jenkins deployment pipelines and improved existing workflows using Git and Bitbucket, with sprint work tracked in Azure Boards.'},
        {role:'Systems Engineer', date:'Nov 2020 – Jul 2022', text:'Developed reusable React interfaces and worked separately on Salesforce Lightning Web Components for enterprise applications.'}
      ]
    },
    cybersenz: {
      kicker:'CYBERSENZ / JAN – JUN 2026', title:'From customer conversations to real software',
      parts:[
        {role:'Discover', date:'Customer collaboration', text:'Spoke directly with healthcare stakeholders to understand operational problems and choose a practical technical approach.'},
        {role:'Build', date:'Independent engineering', text:'Personally developed connected user interfaces, voice interactions, and message and document-processing workflows.'},
        {role:'Deliver', date:'Production ownership', text:'Demonstrated iterative releases, incorporated feedback, and delivered applications used by customers. Private client details are intentionally withheld.'}
      ]
    },
    ibm: {
      kicker:'IBM / JUN – AUG 2026', title:'Making AI-assisted compliance easier to navigate',
      parts:[
        {role:'Investigate', date:'User-facing experience', text:'Created interactive workflows for investigating security findings and reviewing explanations and remediation guidance.'},
        {role:'Connect', date:'Engineering integration', text:'Implemented conditional logic connecting findings, remediation actions, follow-up re-validation triggers, and compliance-document updates.'},
        {role:'Enable', date:'Developer experience', text:'Prepared reusable setup and troubleshooting materials that improved onboarding for other developers.'}
      ]
    }
  };
  const panel=document.getElementById('journey-expanded');
  const kicker=document.getElementById('journey-detail-kicker');
  const title=document.getElementById('journey-detail-title');
  const body=document.getElementById('journey-detail-body');
  const buttons=[...document.querySelectorAll('[data-journey]')];
  const close=panel?.querySelector('.journey-close');
  if (!panel || !kicker || !title || !body || !close) return;
  let selected=null;
  function hide(returnFocus=false){
    const old=selected;
    panel.hidden=true;selected=null;
    buttons.forEach(b=>b.setAttribute('aria-expanded','false'));
    if(returnFocus && old) buttons.find(b=>b.dataset.journey===old)?.focus();
  }
  buttons.forEach(btn=>btn.addEventListener('click',()=>{
    const key=btn.dataset.journey;
    if(key===selected){hide();return;}
    const profile=profiles[key];if(!profile)return;
    kicker.textContent=profile.kicker;title.textContent=profile.title;
    body.replaceChildren(...profile.parts.map(part=>{
      const el=document.createElement('div');el.className='journey-detail-part';
      const h=document.createElement('strong');h.textContent=part.role;
      const d=document.createElement('span');d.className='detail-dates';d.textContent=part.date;
      const p=document.createElement('p');p.textContent=part.text;
      el.append(h,d,p);return el;
    }));
    selected=key;panel.hidden=false;
    buttons.forEach(b=>b.setAttribute('aria-expanded',String(b===btn)));
    panel.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});
  }));
  close.addEventListener('click',()=>hide(true));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)hide(true)});
})();
