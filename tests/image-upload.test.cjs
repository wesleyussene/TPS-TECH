const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const source=fs.readFileSync(__dirname+'/../dist/admin.js','utf8');const fn=source.slice(source.indexOf('async function uploadImage('),source.indexOf("\n$('#hero-upload')"));
for(const webp of [true,false])test('uploads with WebP encoding '+webp,async()=>{
 const assets=[],calls=[];let closed=false;const ctx={fillRect(){},drawImage(){}};
 const canvas={getContext:()=>ctx,toBlob(cb,type){calls.push([type,this.width]);const mime=!webp&&type==='image/webp'?'image/png':type;cb(new Blob([new Uint8Array(this.width>1200?460000:100)],{type:mime}));}};
 const context=vm.createContext({assets,createImageBitmap:async()=>({width:2000,height:1500,close(){closed=true;}}),document:{createElement:()=>canvas},crypto:crypto.webcrypto,Uint8Array,btoa,Blob});
 vm.runInContext(fn,context);const path=await context.uploadImage({type:'image/png',size:10000});
 assert.equal(closed,true);assert.equal(assets.length,1);assert.ok(path.endsWith(webp?'.webp':'.jpg'));assert.ok(calls.some(c=>c[1]===1200));
});
