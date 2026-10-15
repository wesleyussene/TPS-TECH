const {categories,canonicalName,subcategoriesFor}=window.TOP_TAXONOMY;
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
const params=new URLSearchParams(location.search);
const requestedCategory=canonicalName(params.get('category'));
const initialCategory=categories.some(c=>c.name===requestedCategory)?requestedCategory:'Todos';
const state = {category:initialCategory,subcategory:subcategoriesFor(initialCategory).includes(params.get('subcategory'))?params.get('subcategory'):'',query:'',page:1};
const esc = (s) => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const normalize = s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const price = p => typeof p.price==='number' ? new Intl.NumberFormat('pt-MZ',{style:'currency',currency:'MZN'}).format(p.price) : 'Preço sob consulta';
function imageMarkup(p){return p.image ? `<img class="product-image" src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">` : `<div class="image-placeholder">${icon('image')}<span>Imagem em breve</span></div>`;}
document.querySelector('#category-grid').innerHTML=categories.map(c=>`<article class="category-group"><a class="category-card" href="#produtos" data-category="${esc(c.name)}"><span class="category-icon">${icon(c.icon)}</span><strong>${esc(c.name)}</strong><span>${esc(c.caption)}</span>${icon('arrow')}</a><details class="category-subcategories"><summary>Explorar subcategorias <span>(${c.subcategories.length})</span></summary><ul>${c.subcategories.map(sub=>`<li><a href="#produtos" data-category="${esc(c.name)}" data-subcategory="${esc(sub)}">${esc(sub)}</a></li>`).join('')}</ul></details></article>`).join('');
document.querySelector('#category-filter').innerHTML='<option value="Todos">Todas as categorias</option>'+categories.map(c=>`<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('');
function updateSubcategories(){
  const select=document.querySelector('#subcategory-filter');
  select.innerHTML='<option value="">Todas as subcategorias</option>'+subcategoriesFor(state.category).map(sub=>`<option value="${esc(sub)}">${esc(sub)}</option>`).join('');
  select.value=state.subcategory;
  document.querySelector('#subcategory-field').hidden=state.category==='Todos';
}
updateSubcategories();
function render(){
  const matches=mixedProducts.filter(p=>(state.category==='Todos'||p.category===state.category)&&(!state.subcategory||p.subcategory===state.subcategory)&&normalize(`${p.name} ${p.category} ${p.subcategory||''} ${p.description}`).includes(normalize(state.query.trim())));
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
  document.querySelector('#category-filter').value=state.category;
  document.querySelectorAll('[data-category]').forEach(a=>{const selected=a.dataset.category===state.category&&(!a.dataset.subcategory||a.dataset.subcategory===state.subcategory);a.classList.toggle('selected',selected);if(selected)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
}
document.addEventListener('click',e=>{
  const category=e.target.closest('[data-category]');
  if(category){state.category=category.dataset.category;state.subcategory=category.dataset.subcategory||'';state.query='';state.page=1;document.querySelector('#search').value='';updateSubcategories();render();}
  const detail=e.target.closest('[data-product]');
  if(detail)openProduct(detail.dataset.product);
});
document.querySelector('#category-filter').addEventListener('change',e=>{state.category=e.target.value;state.subcategory='';state.page=1;updateSubcategories();render();});
document.querySelector('#subcategory-filter').addEventListener('change',e=>{state.subcategory=e.target.value;state.page=1;render();});
document.querySelector('#search').addEventListener('input',e=>{state.query=e.target.value;state.category='Todos';state.subcategory='';state.page=1;updateSubcategories();render();});
document.querySelector('#search-form').addEventListener('submit',e=>{e.preventDefault();document.querySelector('#produtos').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
document.querySelector('#reset-search').addEventListener('click',()=>{state.category='Todos';state.subcategory='';state.query='';state.page=1;document.querySelector('#search').value='';updateSubcategories();render();});
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
