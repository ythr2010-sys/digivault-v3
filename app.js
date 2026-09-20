/* =========================================================
   Digital Products Store — Shared Application Logic
   localStorage-based demo (auth / cart / orders / products)
   ========================================================= */
const CUR = 'ر.س';
const LS = { cart:'dp_cart', users:'dp_users', session:'dp_session',
             orders:'dp_orders', products:'dp_custom_products', theme:'dp_theme' };

/* ---------- Base catalogue ---------- */
const BASE_PRODUCTS = [
  {id:'p1',title:'حزمة قوالب تصاميم احترافية',cat:'تصميم',price:149,old:249,rating:4.8,sales:1240,
   icon:'🎨',img:'linear-gradient(135deg,#6366f1,#a855f7)',desc:'أكثر من 500 قالب قابل للتعديل جاهز للاستخدام في مشاريعك التجارية والشخصية.',tags:['قوالب','فوتوشوب','جاهز']},
  {id:'p2',title:'دورة تعلم البرمجة من الصفر',cat:'دورات',price:299,old:499,rating:4.9,sales:2870,
   icon:'💻',img:'linear-gradient(135deg,#0ea5e9,#22d3ee)',desc:'مسار كامل لتعلم البرمجة عبر 120 درساً عملياً مع مشاريع تطبيقية.',tags:['دورة','برمجة','مشاريع']},
  {id:'p3',title:'قالب موقع شركة متجاوب',cat:'قوالب ويب',price:199,old:0,rating:4.7,sales:860,
   icon:'🌐',img:'linear-gradient(135deg,#f43f5e,#fb923c)',desc:'قالب موقع تعريفي للشركات بتصميم عصري ومتجاوب بالكامل.',tags:['HTML','متجاوب','شركات']},
  {id:'p4',title:'مكتبة مؤثرات صوتية',cat:'صوتيات',price:89,old:139,rating:4.6,sales:1530,
   icon:'🎧',img:'linear-gradient(135deg,#14b8a6,#84cc16)',desc:'أكثر من 800 مؤثر صوتي عالي الجودة مناسب للمونتاج والمشاريع.',tags:['صوت','مونتاج','WAV']},
  {id:'p5',title:'حزمة أيقونات SVG ضخمة',cat:'تصميم',price:59,old:0,rating:4.5,sales:2110,
   icon:'⭐',img:'linear-gradient(135deg,#eab308,#f97316)',desc:'1200 أيقونة SVG قابلة للتخصيص بسهولة عبر الألوان والحجم.',tags:['أيقونات','SVG','واجهات']},
  {id:'p6',title:'كتاب إلكتروني: التجارة الرقمية',cat:'كتب',price:79,old:129,rating:4.9,sales:970,
   icon:'📘',img:'linear-gradient(135deg,#8b5cf6,#ec4899)',desc:'دليل عملي لبناء مشروع تجارة إلكترونية رابح خطوة بخطوة.',tags:['كتاب','PDF','تجارة']},
  {id:'p7',title:'قالب متجر إلكتروني كامل',cat:'قوالب ويب',price:449,old:699,rating:5.0,sales:430,
   icon:'🛒',img:'linear-gradient(135deg,#3b82f6,#8b5cf6)',desc:'نظام متجر كامل مع سلة ودفع ولوحة تحكم جاهز للتخصيص.',tags:['متجر','دفع','لوحة تحكم']},
  {id:'p8',title:'قوالب عروض تقديمية (Slides)',cat:'تصميم',price:119,old:179,rating:4.7,sales:1380,
   icon:'📊',img:'linear-gradient(135deg,#f97316,#ef4444)',desc:'60 قالب عرض تقديمي احترافي بصيغ PowerPoint و Google Slides.',tags:['عروض','PPTX','أعمال']},
  {id:'p9',title:'دورة المونتاج الاحترافي',cat:'دورات',price:349,old:549,rating:4.8,sales:1160,
   icon:'🎬',img:'linear-gradient(135deg,#06b6d4,#3b82f6)',desc:'تعلّم المونتاج من الصفر حتى الاحتراف باستخدام بريمير وأفتر إفكت.',tags:['مونتاج','فيديو','دورة']},
  {id:'p10',title:'حزمة خطوط عربية احترافية',cat:'تصميم',price:99,old:0,rating:4.6,sales:1880,
   icon:'🔤',img:'linear-gradient(135deg,#a78bfa,#34d399)',desc:'45 خطاً عربياً مرخصاً للاستخدام التجاري في تصاميمك.',tags:['خطوط','عربي','تجاري']},
  {id:'p11',title:'قوالب سوشال ميديا جاهزة',cat:'تصميم',price:69,old:109,rating:4.7,sales:2450,
   icon:'📱',img:'linear-gradient(135deg,#ec4899,#f43f5e)',desc:'320 تصميم جاهز لمنشورات وستوريات انستقرام وتويتر.',tags:['سوشال','انستقرام','جاهز']},
  {id:'p12',title:'أداة حساب الربح والضرائب (Excel)',cat:'كتب',price:49,old:0,rating:4.4,sales:640,
   icon:'📈',img:'linear-gradient(135deg,#22c55e,#16a34a)',desc:'ملف Excel ذكي لحساب الأرباح والمصروفات والضرائب تلقائياً.',tags:['Excel','محاسبة','ذكي']}
];
const CATEGORIES = ['الكل','تصميم','دورات','قوالب ويب','صوتيات','كتب'];

/* ---------- Storage helpers ---------- */
const read = (k,fb) => { try{ const v=localStorage.getItem(k); return v?JSON.parse(v):fb }catch(e){ return fb } };
const write = (k,v) => { try{ localStorage.setItem(k,JSON.stringify(v)) }catch(e){} };
const money = n => Number(n).toFixed(2) + ' ' + CUR;

/* ---------- Products ---------- */
function getProducts(){ return BASE_PRODUCTS.concat(read(LS.products,[])) }
function getProduct(id){ return getProducts().find(p=>p.id===id) }
function addProduct(data){
  const list = read(LS.products,[]);
  data.id = 'u' + Date.now();
  data.rating = 5.0; data.sales = 0; data.icon = data.icon || '📦';
  data.img = data.img || 'linear-gradient(135deg,#6d28d9,#8b5cf6)';
  list.unshift(data); write(LS.products,list); return data;
}

/* ---------- Cart ---------- */
let cart = read(LS.cart,[]);
function saveCart(){ write(LS.cart,cart); updateCartBadge() }
function addToCart(id,qty=1){
  const it = cart.find(c=>c.id===id);
  if(it) it.qty += qty; else cart.push({id,qty});
  saveCart(); toast('تمت إضافة المنتج إلى السلة ✓','success');
}
function removeFromCart(id){ cart = cart.filter(c=>c.id!==id); saveCart() }
function setQty(id,q){ const it=cart.find(c=>c.id===id); if(!it)return; it.qty=Math.max(1,q); saveCart() }
function cartCount(){ return cart.reduce((s,c)=>s+c.qty,0) }
function cartItems(){ return cart.map(c=>({...c, product:getProduct(c.id)})).filter(c=>c.product) }
function cartSubtotal(){ return cartItems().reduce((s,c)=>s+c.product.price*c.qty,0) }
function updateCartBadge(){
  document.querySelectorAll('[data-cart-badge]').forEach(el=>{
    const n = cartCount(); el.textContent = n; el.style.display = n? 'grid':'none';
  });
}

/* ---------- Auth ---------- */
function getUsers(){ return read(LS.users,[]) }
function currentUser(){
  const s = read(LS.session,null); if(!s) return null;
  return getUsers().find(u=>u.email===s.email) || null;
}
function registerUser({name,email,password}){
  const users = getUsers();
  if(users.some(u=>u.email===email)) throw new Error('هذا البريد مسجّل مسبقاً');
  const user = {name,email,password,joined:new Date().toISOString(),avatar:name.trim().charAt(0)};
  users.push(user); write(LS.users,users);
  write(LS.session,{email}); return user;
}
function loginUser(email,password){
  const u = getUsers().find(x=>x.email===email);
  if(!u) throw new Error('لا يوجد حساب بهذا البريد');
  if(u.password!==password) throw new Error('كلمة المرور غير صحيحة');
  write(LS.session,{email}); return u;
}
function logoutUser(){ localStorage.removeItem(LS.session); location.href='index.html' }

/* ---------- Orders ---------- */
function getOrders(){ return read(LS.orders,[]) }
function myOrders(){ const u=currentUser(); return u? getOrders().filter(o=>o.email===u.email) : [] }
function placeOrder(info){
  const items = cartItems();
  if(!items.length) throw new Error('السلة فارغة');
  const order = {
    id:'ORD-' + Math.floor(100000+Math.random()*899999),
    email: info.email, name: info.name, phone: info.phone, address: info.address,
    pay: info.pay, date: new Date().toISOString(),
    total: cartSubtotal(), items: items.map(c=>({title:c.product.title, qty:c.qty, price:c.product.price}))
  };
  const all = getOrders(); all.unshift(order); write(LS.orders, all);
  cart = []; saveCart(); return order;
}

/* ---------- Toast ---------- */
function toast(msg,type=''){
  let wrap = document.querySelector('.toast-wrap');
  if(!wrap){ wrap=document.createElement('div'); wrap.className='toast-wrap'; document.body.appendChild(wrap) }
  const t = document.createElement('div'); t.className='toast '+type; t.textContent=msg;
  wrap.appendChild(t); setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateX(-30px)';
    setTimeout(()=>t.remove(),300) }, 2600);
}

/* ---------- Theme ---------- */
function initTheme(){
  const saved = read(LS.theme,'light');
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}
function toggleTheme(){
  const cur = document.documentElement.getAttribute('data-theme')==='dark' ? 'light':'dark';
  document.documentElement.setAttribute('data-theme',cur); write(LS.theme,cur); updateThemeIcon(cur);
}
function updateThemeIcon(t){
  document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.textContent = t==='dark' ? '☀️':'🌙');
}

/* ---------- Header / Footer ---------- */
const NAV = [
  {href:'index.html', label:'الرئيسية'},
  {href:'store.html', label:'المتجر'},
  {href:'about.html', label:'من نحن'},
  {href:'faq.html', label:'الأسئلة الشائعة'},
  {href:'contact.html', label:'تواصل معنا'}
];
function renderHeader(){
  const host = document.getElementById('site-header'); if(!host) return;
  const page = location.pathname.split('/').pop() || 'index.html';
  const u = currentUser();
  const links = NAV.map(l=>`<a href="${l.href}" class="${l.href===page?'active':''}">${l.label}</a>`).join('');
  const mlinks = NAV.map(l=>`<a href="${l.href}" class="${l.href===page?'active':''}">${l.label}</a>`).join('')
    + `<a href="dashboard.html">حسابي</a>`;
  host.innerHTML = `
  <header class="site-header">
    <div class="container nav">
      <a href="index.html" class="logo"><span class="logo-mark">◈</span><span>رقميّات<b> ستور</b></span></a>
      <nav class="nav-links">${links}</nav>
      <div class="nav-actions">
        <button class="icon-btn" data-theme-toggle aria-label="تبديل المظهر">🌙</button>
        <a href="cart.html" class="icon-btn" aria-label="السلة">🛒<span class="badge" data-cart-badge style="display:none">0</span></a>
        ${u
          ? `<a href="dashboard.html" class="btn btn-primary btn-sm">${u.name.split(' ')[0]} 👤</a>`
          : `<a href="login.html" class="btn btn-primary btn-sm">تسجيل الدخول</a>`}
        <button class="icon-btn hamburger" id="hamburger" aria-label="القائمة">☰</button>
      </div>
    </div>
    <nav class="mobile-nav" id="mobileNav">${mlinks}</nav>
  </header>`;
  host.querySelector('[data-theme-toggle]').addEventListener('click', toggleTheme);
  updateThemeIcon(document.documentElement.getAttribute('data-theme'));
  const hb = host.querySelector('#hamburger'), mn = host.querySelector('#mobileNav');
  hb.addEventListener('click', ()=> mn.classList.toggle('open'));
  updateCartBadge();
}
function renderFooter(){
  const host = document.getElementById('site-footer'); if(!host) return;
  host.innerHTML = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <a href="index.html" class="logo" style="margin-bottom:14px"><span class="logo-mark">◈</span><span>رقميّات<b> ستور</b></span></a>
          <p>متجرك الأول للمنتجات الرقمية: قوالب، دورات، كتب إلكترونية وأدوات جاهزة للتحميل الفوري.</p>
          <div class="social">
            <a href="#" aria-label="تويتر">𝕏</a><a href="#" aria-label="انستقرام">◉</a>
            <a href="#" aria-label="يوتيوب">▶</a><a href="#" aria-label="واتساب">✆</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>روابط سريعة</h4>
          <a href="index.html">الرئيسية</a><a href="store.html">المتجر</a>
          <a href="about.html">من نحن</a><a href="contact.html">تواصل معنا</a>
        </div>
        <div class="footer-col">
          <h4>السياسات</h4>
          <a href="privacy.html">سياسة الخصوصية</a><a href="terms.html">الشروط والأحكام</a>
          <a href="refund.html">سياسة الاسترجاع</a><a href="faq.html">الأسئلة الشائعة</a>
        </div>
        <div class="footer-col">
          <h4>النشرة البريدية</h4>
          <p>اشترك ليصلك كل جديد وعروض حصرية.</p>
          <form onsubmit="event.preventDefault();toast('تم الاشتراك بنجاح ✓','success');this.reset()">
            <input type="email" required placeholder="بريدك الإلكتروني"
              style="width:100%;padding:12px;border-radius:12px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);margin-bottom:10px">
            <button class="btn btn-primary btn-block btn-sm" type="submit">اشترك الآن</button>
          </form>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 رقميّات ستور — جميع الحقوق محفوظة.</span>
        <div class="pay"><span>VISA</span><span>MasterCard</span><span>PayPal</span><span>مدى</span></div>
      </div>
    </div>
  </footer>`;
}

/* ---------- Product card ---------- */
function productCard(p){
  const sale = p.old && p.old>p.price;
  const off = sale ? Math.round((1-p.price/p.old)*100) : 0;
  return `
  <article class="card fade-up">
    <a href="product.html?id=${p.id}">
      <div class="p-thumb" style="background:${p.img}">
        <span>${p.icon||'📦'}</span>
        <span class="p-badge">${p.cat}</span>
        ${sale?`<span class="p-sale">-${off}%</span>`:''}
      </div>
    </a>
    <div class="p-body">
      <div class="p-cat">${p.cat}</div>
      <a href="product.html?id=${p.id}"><h3 class="p-title">${p.title}</h3></a>
      <div class="p-meta">
        <span class="stars">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5-Math.round(p.rating))}</span>
        <span>${p.rating}</span><span>·</span><span>${p.sales} مبيع</span>
      </div>
      <div class="p-price"><b>${money(p.price)}</b>${sale?`<s>${money(p.old)}</s>`:''}</div>
      <div class="p-actions">
        <button class="btn btn-primary btn-sm" onclick="addToCart('${p.id}')">أضف للسلة</button>
        <a class="btn btn-outline btn-sm" href="product.html?id=${p.id}">تفاصيل</a>
      </div>
    </div>
  </article>`;
}
function stars(r){ return '★'.repeat(Math.round(r)) + '☆'.repeat(5-Math.round(r)) }

/* ---------- Init ---------- */
function initPage(){
  initTheme(); renderHeader(); renderFooter();
}
document.addEventListener('DOMContentLoaded', initPage);
window.addEventListener('storage', ()=>{ cart = read(LS.cart,[]); updateCartBadge() });
