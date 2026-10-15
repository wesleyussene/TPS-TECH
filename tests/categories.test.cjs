const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const taxonomy=require('../dist/categories.js');
const {validateContent}=require('../dist/lib/content-schema.cjs');
const seed=JSON.parse(fs.readFileSync(__dirname+'/../dist/content.json'));

test('the requested taxonomy has 17 unique categories and 86 scoped subcategories',()=>{
  assert.deepEqual(taxonomy.categories.map(c=>c.name),[
    'Computadores e Monitores','Acessórios de Informática','Armazenamento e Componentes',
    'Telemóveis e Tablets','Relógios e Pulseiras Inteligentes','Impressoras e Consumíveis',
    'Gaming','Televisores e Acessórios','Som e Áudio','Redes e Internet','Segurança Eletrónica',
    'Projeção e Apresentação','Fotografia e Vídeo','Equipamentos para Comércio',
    'Energia e Proteção Elétrica','Mochilas e Bolsas','Eletrodomésticos'
  ]);
  assert.equal(taxonomy.categories.reduce((n,c)=>n+c.subcategories.length,0),86);
  for(const c of taxonomy.categories)assert.equal(new Set(c.subcategories).size,c.subcategories.length);
});

test('legacy category names resolve to one canonical category',()=>{
  for(const [oldName,newName] of Object.entries({
    Computadores:'Computadores e Monitores',Acessórios:'Acessórios de Informática',
    Smartphones:'Telemóveis e Tablets',Wearables:'Relógios e Pulseiras Inteligentes',
    Áudio:'Som e Áudio',Gaming:'Gaming'
  })){
    assert.equal(taxonomy.canonicalName(oldName),newName);
    assert.equal(taxonomy.categories.filter(c=>c.name===newName).length,1);
    const input=structuredClone(seed);
    input.products[0].category=oldName;
    delete input.products[0].subcategory;
    const product=validateContent(input).products[0];
    assert.equal(product.category,newName);
    assert.equal(product.subcategory,'');
  }
});

test('every supplied subcategory survives server validation under its parent',()=>{
  for(const c of taxonomy.categories)for(const subcategory of c.subcategories){
    const input=structuredClone(seed);
    Object.assign(input.products[0],{category:c.name,subcategory});
    const product=validateContent(input).products[0];
    assert.equal(product.category,c.name);
    assert.equal(product.subcategory,subcategory);
  }
});

test('invalid categories, cross-category subcategories and malformed values are rejected',()=>{
  for(const update of [
    {category:'Inventada',subcategory:''},
    {category:'Gaming',subcategory:'Laptops'},
    {category:'Gaming',subcategory:'<script>alert(1)</script>'},
    {category:'Gaming',subcategory:null},
    {category:'Gaming',subcategory:[]}
  ]){
    const input=structuredClone(seed);
    Object.assign(input.products[0],update);
    assert.throws(()=>validateContent(input));
  }
});

test('shared names remain scoped to their parent, and current products are valid',()=>{
  for(const name of ['Telemóveis e Tablets','Televisores e Acessórios']){
    const input=structuredClone(seed);
    Object.assign(input.products[0],{category:name,subcategory:'Suportes'});
    assert.equal(validateContent(input).products[0].category,name);
  }
  assert.deepEqual(validateContent(seed).products,seed.products);
});

test('browser and server use the same taxonomy and generated product data',()=>{
  const browser={window:{}};
  vm.runInNewContext(fs.readFileSync(__dirname+'/../dist/categories.js','utf8'),browser);
  assert.equal(JSON.stringify(browser.window.TOP_TAXONOMY.categories),JSON.stringify(taxonomy.categories));
  vm.runInNewContext(fs.readFileSync(__dirname+'/../dist/products.js','utf8'),browser);
  assert.equal(JSON.stringify(browser.window.TOP_CONTENT),JSON.stringify(seed));
  assert.equal(browser.window.TOP_PRODUCTS.length,seed.products.filter(p=>p.active!==false).length);
});
