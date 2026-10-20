// Deterministic, synthetic market data. NEVER interpret as actual market research.
export const COUNTRIES=['Bangladesh','United States','India','United Kingdom','Canada','Germany','Brazil','Indonesia'];
export const BRANDS=['Apple','Samsung','Xiaomi','Google','OnePlus','Oppo','Vivo','Realme','Poco','Motorola'];
export const MODELS=[
 ['Apple','iPhone 17 Pro Max','Flagship',1199,48,4832],['Apple','iPhone 16 Pro','Flagship',999,48,3582],['Apple','iPhone 15','Premium',699,48,3349],
 ['Samsung','Galaxy S25 Ultra','Flagship',1299,200,5000],['Samsung','Galaxy S24 Ultra','Flagship',1099,200,5000],['Samsung','Galaxy A55','Midrange',399,50,5000],
 ['Xiaomi','Redmi Note 14','Budget',229,108,5500],['Xiaomi','Xiaomi 15 Ultra','Flagship',1199,50,5410],
 ['Google','Pixel 9 Pro','Flagship',999,50,4700],['Google','Pixel 8','Premium',599,50,4575],
 ['OnePlus','OnePlus 13','Flagship',899,50,6000],['Oppo','Reno 13','Midrange',499,50,5600],
 ['Vivo','Vivo V30','Midrange',399,50,5000],['Realme','Realme GT 6','Premium',599,50,5500],
 ['Poco','Poco X6 Pro','Midrange',349,64,5000],['Motorola','Edge 50 Pro','Midrange',599,50,4500]
].map(([brand,model,segment,referencePriceUSD,mainCameraMP,batteryMAh])=>({brand,model,segment,referencePriceUSD,mainCameraMP,batteryMAh,source:'synthetic illustrative specs — verify with manufacturer before real use'}));
const weights={
 'Bangladesh':[8,23,23,2,7,9,9,9,7,3],
 'United States':[48,27,4,9,5,1,1,1,1,3],
 'India':[8,20,23,2,11,8,12,8,6,2],
 'United Kingdom':[42,29,7,7,6,3,2,1,1,2],
 'Canada':[43,27,6,9,6,3,2,1,1,2],
 'Germany':[34,29,12,8,5,4,3,2,1,2],
 'Brazil':[16,35,16,3,5,8,6,5,3,3],
 'Indonesia':[10,22,18,2,6,13,14,8,5,2]
};
const hash=(...args)=>{let n=2166136261;for(const c of args.join('|'))n=Math.imul(n^c.charCodeAt(0),16777619);return (n>>>0)/4294967295};
export function syntheticMarket(){const rows=[];for(const country of COUNTRIES)for(let year=2024;year<=2026;year++)for(let quarter=1;quarter<=4;quarter++)for(let i=0;i<BRANDS.length;i++){
 const brand=BRANDS[i],base=weights[country][i],noise=(hash(country,year,quarter,brand)-.5)*4;
 const share=Math.max(.2,base+noise+(year-2024)*(i%3===0?.5:-.2));
 const size=Math.round((70000+hash(country,year)*90000)*(country==='India'?8:country==='United States'?4:1));
 rows.push({country,year,quarter,brand,units:Math.round(size*share/100),metric:'estimated_shipments',sourceType:'synthetic',sourceName:'PhonePulse generated demonstration data',isSynthetic:true,updatedAt:'2026-10-01'});
}return rows}
export function marketSummary(rows,{country,year,quarter,metric}={}){const filtered=rows.filter(r=>(!country||country==='Global'||r.country===country)&&(!year||r.year===Number(year))&&(!quarter||r.quarter===Number(quarter))&&(!metric||r.metric===metric));const byBrand=new Map(),byCountry=new Map();for(const r of filtered){byBrand.set(r.brand,(byBrand.get(r.brand)||0)+Number(r.units||0));byCountry.set(r.country,(byCountry.get(r.country)||0)+Number(r.units||0))}const total=[...byBrand.values()].reduce((a,b)=>a+b,0);return {total,brands:[...byBrand].map(([brand,units])=>({brand,units,share:total?Math.round(units/total*1000)/10:0})).sort((a,b)=>b.units-a.units),countries:[...byCountry].map(([country,units])=>({country,units})).sort((a,b)=>b.units-a.units),count:filtered.length,syntheticCount:filtered.filter(r=>r.isSynthetic).length,disclaimer:'Synthetic demonstration shipment estimates. NOT actual sales, shipments, usage, or market share.'}}
export function validateMarketRows(rows){if(!Array.isArray(rows)||rows.length<1||rows.length>3000)throw Error('Upload 1 to 3000 market rows');return rows.map((r,i)=>{const country=String(r.country||'').trim(),brand=String(r.brand||'').trim(),year=Number(r.year),quarter=Number(r.quarter),units=Number(r.units);if(!country||country.length>80||!brand||brand.length>80||!Number.isInteger(year)||year<2000||year>2100||!Number.isInteger(quarter)||quarter<1||quarter>4||!Number.isFinite(units)||units<0||units>1e12)throw Error('Invalid market row '+(i+1));return {country,brand,year,quarter,units,metric:'estimated_shipments',sourceType:'user_upload',sourceName:String(r.sourceName||'User-uploaded market CSV').slice(0,120),isSynthetic:r.isSynthetic===true||String(r.isSynthetic).toLowerCase()==='true',updatedAt:new Date().toISOString()}})}
