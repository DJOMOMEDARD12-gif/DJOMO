
<script>
// ── Comptes démo ──────────────────────────────────────
const DEMO_USERS=[
  {email:'marie@univ-yde.cm',pwd:'Demo1234!',role:'Enseignant',nom:'Marie Ngo Bilong'},
  {email:'k.amon@uhb.edu.ci',pwd:'Demo1234!',role:'Étudiant',nom:'Kouassi Amon'},
  {email:'a.asante@ug.edu.gh',pwd:'Demo1234!',role:'Bibliothécaire',nom:'Abena Asante'},
  {email:'admin@bibliotrop.org',pwd:'Demo1234!',role:'Admin',nom:'Admin Système'},
];

// ── Tabs ─────────────────────────────────────────────
function switchTab(tab,el){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tab-password').style.display=tab==='password'?'block':'none';
  document.getElementById('tab-magic').style.display=tab==='magic'?'block':'none';
  clearErr();
}

// ── Validation ────────────────────────────────────────
function validateEmail(v){
  const ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const el=document.getElementById('email');
  const msg=document.getElementById('err-email');
  if(v.length>3&&!ok){el.classList.add('err');msg.classList.add('show')}
  else{el.classList.remove('err');msg.classList.remove('show')}
  return ok;
}

function clearErr(){
  document.getElementById('err-box').classList.remove('show');
  document.getElementById('ok-box').classList.remove('show');
}
function showErr(msg){
  const b=document.getElementById('err-box');
  document.getElementById('err-txt').textContent=msg;
  b.classList.add('show');
}
function showOk(msg){
  const b=document.getElementById('ok-box');
  document.getElementById('ok-txt').textContent=msg;
  b.classList.add('show');
}

// ── Eye toggle ────────────────────────────────────────
let visible=false;
function toggleEye(){
  visible=!visible;
  const inp=document.getElementById('pwd');
  const btn=document.getElementById('eye-btn');
  inp.type=visible?'text':'password';
  btn.textContent=visible?'🙈':'👁️';
}

// ── Connexion ─────────────────────────────────────────
function tryLogin(){
  const email=document.getElementById('email').value.trim();
  const pwd=document.getElementById('pwd').value;
  const btn=document.getElementById('login-btn');

  // Basic validation
  if(!email){showErr('Veuillez entrer votre adresse email');return}
  if(!validateEmail(email)){showErr('Adresse email invalide');return}
  if(!pwd){
    document.getElementById('pwd').classList.add('err');
    document.getElementById('err-pwd').classList.add('show');
    return;
  }
  document.getElementById('pwd').classList.remove('err');
  document.getElementById('err-pwd').classList.remove('show');

  // Loading state
  btn.disabled=true;
  btn.innerHTML='<div class="spin"></div> Connexion en cours…';

  setTimeout(()=>{
    // Check demo users
    const user=DEMO_USERS.find(u=>u.email===email);
    if(user&&(pwd===user.pwd||pwd.length>=4)){
      // Success
      document.getElementById('login-form').style.display='none';
      const ss=document.getElementById('success-state');
      ss.classList.add('show');
      ss.querySelector('.s-desc').innerHTML=Bienvenue, <strong>${user.nom}</strong> (${user.role}).<br/>Redirection vers votre espace en cours…;
      setTimeout(()=>{
        document.getElementById('redirect-bar').style.width='100%';
      },100);
      setTimeout(()=>{
        showOk('Connexion réussie !');
      },2200);
    }else{
      // Error
      btn.disabled=false;
      btn.innerHTML='Se connecter';
      showErr('Email ou mot de passe incorrect. Essayez un compte démo ci-dessous.');
      document.getElementById('email').classList.add('err');
      // Shake animation
      const card=document.querySelector('.form-wrap');
      card.style.animation='shake .4s ease';
      setTimeout(()=>card.style.animation='',400);
    }
  },1200);
}

// ── Magic link ────────────────────────────────────────
function sendMagic(){
  const email=document.getElementById('magic-email').value.trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showErr('Entrez un email valide');return}
  const btn=document.querySelector('#tab-magic .btn-submit');
  btn.disabled=true;btn.innerHTML='<div class="spin"></div> Envoi en cours…';
  setTimeout(()=>{
    btn.disabled=false;btn.innerHTML='✨ Envoyer le lien magique';
    showOk(Lien envoyé à ${email} — vérifiez votre boîte mail);
  },1400);
}

// ── Social login ──────────────────────────────────────
function socialLogin(provider){
  const btn=event.target;
  btn.disabled=true;btn.textContent='Chargement…';
  setTimeout(()=>{
    btn.disabled=false;btn.textContent=provider==='Google'?'🌐 Google':'🪟 Microsoft';
    showOk(Redirection vers ${provider}…);
  },1000);
}

// ── Forgot password ───────────────────────────────────
function showForgot(){
  document.getElementById('login-form').style.display='none';
  document.getElementById('forgot-panel').classList.add('show');
  document.getElementById('forgot-panel').style.display='block';
}
function hideForgot(){
  document.getElementById('forgot-panel').classList.remove('show');
  document.getElementById('forgot-panel').style.display='none';
  document.getElementById('login-form').style.display='block';
  clearErr();
}
function sendReset(){
  const email=document.getElementById('reset-email').value.trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    document.getElementById('reset-email').classList.add('err');return;
  }
  document.getElementById('reset-email').classList.remove('err');
  const btn=document.querySelector('#forgot-panel .btn-submit');
  btn.disabled=true;btn.innerHTML='<div class="spin"></div> Envoi…';
  setTimeout(()=>{
    btn.disabled=false;btn.innerHTML='📧 Envoyer le lien';
    const ok=document.getElementById('reset-ok');
    ok.className='ok-box show';
    ok.textContent=✅ Lien envoyé à ${email};
  },1200);
}

// ── Quick demo fill ───────────────────────────────────
function fillDemo(email,role){
  document.getElementById('email').value=email;
  document.getElementById('pwd').value='Demo1234!';
  document.getElementById('email').classList.remove('err');
  document.getElementById('err-email').classList.remove('show');
  clearErr();
  // Switch to password tab if needed
  document.getElementById('tab-password').style.display='block';
  document.getElementById('tab-magic').style.display='none';
  document.querySelectorAll('.tab').forEach((t,i)=>{t.classList.toggle('active',i===0)});
  showOk(Compte ${role} chargé — cliquez sur Se connecter);
}

// ── Shake animation ───────────────────────────────────
const style=document.createElement('style');
style.textContent='@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}';
document.head.appendChild(style);

// ── Keyboard ──────────────────────────────────────────
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&document.getElementById('login-form').style.display!=='none'){
    if(document.activeElement.id!=='magic-email')tryLogin();
  }
});
</script>
