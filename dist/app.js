const categories = [
  {name:'Smartphones',icon:'phone',caption:'Sempre ligado'},
  {name:'Computadores',icon:'laptop',caption:'Crie sem limites'},
  {name:'Áudio',icon:'headphones',caption:'Sinta cada detalhe'},
  {name:'Gaming',icon:'game',caption:'Entre no jogo'},
  {name:'Wearables',icon:'watch',caption:'Ao seu ritmo'},
  {name:'Acessórios',icon:'plug',caption:'Complete o seu mundo'}
];
const products = window.TOP_PRODUCTS;
const pageSize = 10;
function shuffled(items){
  const result=[...items];
  for(let i=result.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [result[i],result[j]]=[result[j],result[i]];
  }
  return result;
}
// Shuffle once per visit, then alternate categories without repeating products.
const groups=new Map();
for(const product of shuffled(products)){
  if(!groups.has(product.category))groups.set(product.category,[]);
  groups.get(product.category).push(product);
}
const categoryGroups=shuffled([...groups.values()]);
const mixedProducts=[];
for(let row=0;mixedProducts.length<products.length;row++){
  for(const group of categoryGroups)if(group[row])mixedProducts.push(group[row]);
}
const state = {category:'Todos',query:'',page:1};
const esc = (s) => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const normalize = s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const price = p => typeof p.price==='number' ? new Intl.NumberFormat('pt-MZ',{style:'currency',currency:'MZN'}).format(p.price) : 'Preço sob consulta';
function imageMarkup(p){return p.image ? `<img class="product-image" src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">` : `<div class="image-placeholder">${icon('image')}<span>Imagem em breve</span></div>`;}
document.querySelector('#category-grid').innerHTML=categories.map(c=>`<a class="category-card" href="#produtos" data-category="${esc(c.name)}"><span class="category-icon">${icon(c.icon)}</span><strong>${esc(c.name)}</strong><span>${c.caption}</span>${icon('arrow')}</a>`).join('');
document.querySelector('#filters').innerHTML=['Todos',...categories.map(c=>c.name)].map(c=>`<button type="button" data-filter="${esc(c)}" aria-pressed="${c==='Todos'}">${esc(c)}</button>`).join('');
function render(){
  const matches=mixedProducts.filter(p=>(state.category==='Todos'||p.category===state.category)&&normalize(`${p.name} ${p.category} ${p.description}`).includes(normalize(state.query.trim())));
  const pageCount=Math.max(1,Math.ceil(matches.length/pageSize));
  state.page=Math.min(state.page,pageCount);
  const start=(state.page-1)*pageSize;
  const visible=matches.slice(start,start+pageSize);
  document.querySelector('#product-grid').innerHTML=visible.map(p=>`<article class="product-card"><a class="product-visual" href="produto.html?id=${encodeURIComponent(p.id)}" aria-label="Ver detalhes: ${esc(p.name)}"><span class="product-category">${esc(p.category)}</span>${imageMarkup(p)}<span class="image-number">TS / ${String(products.indexOf(p)+1).padStart(2,'0')}</span></a><div class="product-info"><h3><button data-product="${esc(p.id)}">${esc(p.name)}</button></h3><p>${price(p)}</p><button class="product-details" data-product="${esc(p.id)}">Ver detalhes ${icon('arrow')}</button></div></article>`).join('');
  document.querySelector('#empty-state').hidden=visible.length>0;
  document.querySelector('#result-count').textContent=matches.length>pageSize?`${start+1}–${start+visible.length} de ${matches.length} produtos`:`${matches.length} ${matches.length===1?'produto':'produtos'}`;
  document.querySelector('#catalog-pagination').hidden=pageCount===1;
  document.querySelector('#catalog-page').textContent=`Página ${state.page} de ${pageCount}`;
  document.querySelector('#catalog-previous').disabled=state.page===1;
  document.querySelector('#catalog-next').disabled=state.page===pageCount;
  document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.filter===state.category));
  document.querySelectorAll('[data-category]').forEach(a=>a.classList.toggle('selected',a.dataset.category===state.category));
}
document.addEventListener('click',e=>{
  const category=e.target.closest('[data-category]');
  const filter=e.target.closest('[data-filter]');
  if(category){state.category=category.dataset.category;state.query='';state.page=1;document.querySelector('#search').value='';render();}
  if(filter){state.category=filter.dataset.filter;state.page=1;render();}
  const detail=e.target.closest('[data-product]');
  if(detail)openProduct(detail.dataset.product);
});
document.querySelector('#search').addEventListener('input',e=>{state.query=e.target.value;state.category='Todos';state.page=1;render();});
document.querySelector('#search-form').addEventListener('submit',e=>{e.preventDefault();document.querySelector('#produtos').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
document.querySelector('#reset-search').addEventListener('click',()=>{state.category='Todos';state.query='';state.page=1;document.querySelector('#search').value='';render();});
for(const [selector,step] of [['#catalog-previous',-1],['#catalog-next',1]]){
  document.querySelector(selector).addEventListener('click',()=>{
    state.page=Math.max(1,state.page+step);render();
    document.querySelector('#products-title').focus({preventScroll:true});
    document.querySelector('#produtos').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  });
}
function openProduct(id){location.href='produto.html?id='+encodeURIComponent(id);}
document.querySelector('#year').textContent=new Date().getFullYear();
render();
