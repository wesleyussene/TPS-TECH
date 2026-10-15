/* Shared catalogue taxonomy for the storefront, admin editor and server. */
(function(root){
  'use strict';
  const categories = [
    {name:'Computadores e Monitores', aliases:['Computadores'], icon:'laptop', caption:'Trabalhe, estude e crie', subcategories:['Laptops','Desktop','All-in-One','Monitores']},
    {name:'Acessórios de Informática', aliases:['Acessórios'], icon:'plug', caption:'Complete o seu espaço', subcategories:['Teclados e mouses','Webcams','Carregadores e Baterias','Hubs, Adaptadores e Docking Stations','Suportes e Tapetes para mouse','Cabos']},
    {name:'Armazenamento e Componentes', icon:'storage', caption:'Espaço e desempenho', subcategories:['Discos HDD e SSD','Memórias RAM','Pens USB e Cartões de Memória']},
    {name:'Telemóveis e Tablets', aliases:['Smartphones'], icon:'phone', caption:'Sempre ligado', subcategories:['Telemóveis','Tablets','Capas e protetores','Carregadores, Cabos e Baterias Portáteis','Suportes','Teclados e Canetas para Tablets']},
    {name:'Relógios e Pulseiras Inteligentes', aliases:['Wearables'], icon:'watch', caption:'Ao seu ritmo', subcategories:['Relógios Inteligentes e Pulseiras de Atividade','Braceletes e Acessórios']},
    {name:'Impressoras e Consumíveis', icon:'printer', caption:'Tudo para imprimir', subcategories:['Impressoras','Scanners','Toners e Tinteiros','Papel e Outros Consumíveis']},
    {name:'Gaming', icon:'game', caption:'Entre no jogo', subcategories:['Consolas','Jogos','Joysticks','Auscultadores com Microfone','Acessórios para Consolas']},
    {name:'Televisores e Acessórios', icon:'tv', caption:'Entretenimento em grande', subcategories:['Televisores','TV Box e Streaming','Suportes','Comandos','Cabos e Adaptadores']},
    {name:'Som e Áudio', aliases:['Áudio'], icon:'headphones', caption:'Sinta cada detalhe', subcategories:['Colunas','Soundbars','Auscultadores e Auriculares','Microfones','Acessórios de Áudio']},
    {name:'Redes e Internet', icon:'router', caption:'Ligações que aproximam', subcategories:['Starlink e Acessórios','Routers e Modems','Extensores Wi-Fi, Sistemas Mesh e Pontos de Acesso','Switches','Equipamentos Ponto a Ponto','Cabos e Acessórios de Rede','Bastidores']},
    {name:'Segurança Eletrónica', icon:'shield', caption:'Proteja o que importa', subcategories:['Câmaras e Kits de Vigilância','DVRs e NVRs','Alarmes e Sensores','Videoporteiros','Controlo de Acesso e Assiduidade','Vedações Elétricas','Acessórios de Instalação','Spikes']},
    {name:'Projeção e Apresentação', icon:'projector', caption:'Dê destaque às suas ideias', subcategories:['Projetores','Telas de Projeção','Painéis Interativos','Suportes e Acessórios']},
    {name:'Fotografia e Vídeo', icon:'camera', caption:'Capte cada momento', subcategories:['Câmaras Fotográficas','Objetivas','Tripés e Estabilizadores','Iluminação','Bolsas e Acessórios']},
    {name:'Equipamentos para Comércio', icon:'pos', caption:'Soluções para o seu negócio', subcategories:['Sistemas POS','Impressoras Térmicas','Leitores de Códigos de Barras','Gavetas de Dinheiro','Contadores de Notas','Consumíveis e Acessórios']},
    {name:'Energia e Proteção Elétrica', icon:'power', caption:'Energia com confiança', subcategories:['UPS','Estabilizadores e Protetores de Corrente','Extensões e Réguas Elétricas']},
    {name:'Mochilas e Bolsas', icon:'bag', caption:'Leve o essencial consigo', subcategories:['Mochilas','Pastas e Bolsas']},
    {name:'Eletrodomésticos', icon:'home', caption:'Praticidade para a sua casa', subcategories:['Ar Condicionado','Frigoríficos e Congeladores','Máquinas de Lavar e Secar Roupa','Máquinas de Lavar Loiça','Fogões e Fornos','Micro-ondas','AirFryer','Ferros de Engomar','Aspiradores','Termoacumuladores','Exaustores']}
  ];
  function canonicalName(name){
    return categories.find(c=>c.name===name||c.aliases?.includes(name))?.name||name;
  }
  function subcategoriesFor(name){
    return categories.find(c=>c.name===canonicalName(name))?.subcategories||[];
  }
  const taxonomy={categories,canonicalName,subcategoriesFor};
  if(typeof module==='object'&&module.exports)module.exports=taxonomy;
  else root.TOP_TAXONOMY=taxonomy;
})(typeof window==='object'?window:globalThis);
