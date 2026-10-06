const products = [
  {id:1,name:"Luna Shoulder Bag",category:"Bags",price:1890,old:2290,art:"bag"},
  {id:2,name:"Aura Glow Set",category:"Beauty",price:1290,old:1590,art:"beauty"},
  {id:3,name:"Élan Gold Ring",category:"Jewelry",price:990,old:1190,art:"jewelry"},
  {id:4,name:"Sage Essential Dress",category:"Fashion",price:2490,old:2990,art:"fashion"},
  {id:5,name:"Mira Mini Bag",category:"Bags",price:1590,old:1890,art:"bag"},
  {id:6,name:"Velvet Lip Duo",category:"Beauty",price:790,old:990,art:"beauty"},
  {id:7,name:"Sol Pearl Ring",category:"Jewelry",price:1190,old:1390,art:"jewelry"},
  {id:8,name:"Noor Satin Top",category:"Fashion",price:1790,old:2190,art:"fashion"}
];

let cart = JSON.parse(localStorage.getItem("lumoraCart") || "[]");
const $ = s => document.querySelector(s);
const money = n => "৳" + n.toLocaleString("en-BD");

function art(type){
  return `<div class="product-art"><div class="art-${type}"></div></div>`;
}
function renderProducts(filter="All"){
  const list = filter==="All" ? products : products.filter(p=>p.category===filter);
  $("#productGrid").innerHTML = list.map(p=>`
    <article class="product-card">
      <div class="product-img ${p.art}">${art(p.art)}</div>
      <button class="add-btn" onclick="addToCart(${p.id})" aria-label="Add ${p.name} to cart">+</button>
      <div class="product-info"><small>${p.category.toUpperCase()}</small><h3>${p.name}</h3><div class="price">${money(p.price)} <span class="old">${money(p.old)}</span></div></div>
    </article>`).join("");
}
function save(){localStorage.setItem("lumoraCart",JSON.stringify(cart));}
function addToCart(id){
  const p=products.find(x=>x.id===id);
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++; else cart.push({...p,qty:1});
  save();renderCart();showToast(`${p.name} added to cart`);
}
function renderCart(){
  const count=cart.reduce((a,b)=>a+b.qty,0);
  $("#cartCount").textContent=count;
  if(!cart.length){$("#cartItems").innerHTML='<p class="empty">Your cart is empty.</p>';$("#cartTotal").textContent="৳0";return;}
  $("#cartItems").innerHTML=cart.map(i=>`
    <div class="cart-row">
      <div class="mini-art">${art(i.art)}</div>
      <div><h4>${i.name}</h4><small>${money(i.price)} × ${i.qty}</small></div>
      <button class="remove" onclick="removeFromCart(${i.id})">Remove</button>
    </div>`).join("");
  $("#cartTotal").textContent=money(cart.reduce((a,b)=>a+b.price*b.qty,0));
}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);save();renderCart();}
function openCart(){ $("#cartDrawer").classList.add("open"); $("#overlay").classList.add("show"); }
function closeCart(){ $("#cartDrawer").classList.remove("open"); $("#overlay").classList.remove("show"); }
function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800);}

document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProducts(b.dataset.filter);}));
document.querySelectorAll(".category-card").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===b.dataset.category));renderProducts(b.dataset.category);location.hash="shop";}));
$("#cartBtn").onclick=openCart; $("#closeCart").onclick=closeCart; $("#overlay").onclick=closeCart;
$("#menuBtn").onclick=()=>$("#nav").classList.toggle("open");
$("#searchBtn").onclick=()=>{ $("#searchPanel").classList.add("open");$("#searchInput").focus(); };
$("#closeSearch").onclick=()=>$("#searchPanel").classList.remove("open");
$("#searchInput").addEventListener("input",e=>{
  const q=e.target.value.toLowerCase().trim();
  const found=products.filter(p=>(p.name+" "+p.category).toLowerCase().includes(q));
  $("#searchResults").innerHTML=q?found.map(p=>`<div class="search-result" onclick="addToCart(${p.id})"><b>${p.name}</b><small>${p.category} · ${money(p.price)}</small></div>`).join("")||"<p>No products found.</p>":"";
});
$("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();showToast("Welcome to Lumora ✦");e.target.reset();});
$("#checkoutBtn").onclick=()=>{if(!cart.length){showToast("Your cart is empty");return;}showToast("Demo checkout ready — connect your payment system here.");};
$("#wishlistBtn").onclick=()=>showToast("Wishlist feature ready to connect.");
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCart();$("#searchPanel").classList.remove("open");}});
renderProducts();renderCart();
