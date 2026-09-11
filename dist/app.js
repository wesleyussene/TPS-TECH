const categories = [
  {name:'Smartphones',icon:'phone',caption:'Sempre ligado'},
  {name:'Computadores',icon:'laptop',caption:'Crie sem limites'},
  {name:'Áudio',icon:'headphones',caption:'Sinta cada detalhe'},
  {name:'Gaming',icon:'game',caption:'Entre no jogo'},
  {name:'Wearables',icon:'watch',caption:'Ao seu ritmo'},
  {name:'Acessórios',icon:'plug',caption:'Complete o seu mundo'}
];
const products = window.TOP_PRODUCTS;
const state = {category:'Todos',query:''};
const esc = (s) => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const normalize = s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const price = p => typeof p.price==='number' ? new Intl.NumberFormat('pt-MZ',{style:'currency',currency:'MZN'}).format(p.price) : 'Preço sob consulta';
function imageMarkup(p){return p.image ? `<img class="product-image" src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">` : `<div class="image-placeholder">${icon('image')}<span>Imagem em breve</span></div>`;}
document.querySelector('#category-grid').innerHTML=categories.map(c=>`<a class="category-card" href="#produtos" data-category="${esc(c.name)}"><span class="category-icon">${icon(c.icon)}</span><strong>${esc(c.name)}</strong><span>${c.caption}</span>${icon('arrow')}</a>`).join('');
document.querySelector('#filters').innerHTML=['Todos',...categories.map(c=>c.name)].map(c=>`<button type="button" data-filter="${esc(c)}" aria-pressed="${c==='Todos'}">${esc(c)}</button>`).join('');
function render(){
  const visible=products.filter(p=>(state.category==='Todos'||p.category===state.category)&&normalize(`${p.name} ${p.category} ${p.description}`).includes(normalize(state.query.trim())));
  document.querySelector('#product-grid').innerHTML=visible.map(p=>`<article class="product-card"><button class="product-visual" data-product="${esc(p.id)}" aria-label="Ver detalhes: ${esc(p.name)}"><span class="product-category">${esc(p.category)}</span>${imageMarkup(p)}<span class="image-number">TS / ${String(products.indexOf(p)+1).padStart(2,'0')}</span></button><div class="product-info"><h3><button data-product="${esc(p.id)}">${esc(p.name)}</button></h3><p>${price(p)}</p><button class="product-details" data-product="${esc(p.id)}">Ver detalhes ${icon('arrow')}</button></div></article>`).join('');
  document.querySelector('#empty-state').hidden=visible.length>0;
  document.querySelector('#result-count').textContent=`${visible.length} ${visible.length===1?'produto':'produtos'}`;
  document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.filter===state.category));
  document.querySelectorAll('[data-category]').forEach(a=>a.classList.toggle('selected',a.dataset.category===state.category));
}
document.addEventListener('click',e=>{
  const category=e.target.closest('[data-category]');
  const filter=e.target.closest('[data-filter]');
  if(category){state.category=category.dataset.category;state.query='';document.querySelector('#search').value='';render();}
  if(filter){state.category=filter.dataset.filter;render();}
  const detail=e.target.closest('[data-product]');
  if(detail)openProduct(detail.dataset.product);
});
document.querySelector('#search').addEventListener('input',e=>{state.query=e.target.value;state.category='Todos';render();});
document.querySelector('#search-form').addEventListener('submit',e=>{e.preventDefault();document.querySelector('#produtos').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
document.querySelector('#reset-search').addEventListener('click',()=>{state.category='Todos';state.query='';document.querySelector('#search').value='';render();});
const dialog=document.querySelector('#product-dialog');
function openProduct(id){const p=products.find(p=>p.id===id);if(!p)return;
 document.querySelector('#dialog-content').innerHTML=`<div class="dialog-image">${imageMarkup(p)}</div><div class="dialog-info"><span class="eyebrow section-kicker">${esc(p.category)}</span><h2 id="dialog-title">${esc(p.name)}</h2><p>${esc(p.description)}</p><strong class="dialog-price">${price(p)}</strong><div class="availability-note">Catálogo em preparação. O modelo, as especificações e a disponibilidade deste produto ainda estão por confirmar.</div><button class="button button-dark" id="continue-browsing">Continuar a explorar ${icon('arrow')}</button></div>`;
 dialog.showModal();document.querySelector('#continue-browsing').onclick=()=>dialog.close();
}
document.querySelector('.dialog-close').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.querySelector('#year').textContent=new Date().getFullYear();
render();
