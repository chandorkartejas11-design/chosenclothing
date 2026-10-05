const products = [
  {id:1,name:"240 GSM Oversized T-Shirt",price:600,cat:"tops",label:"Oversized",art:"tee"},
  {id:2,name:"180 GSM Regular Fit T-Shirt",price:300,cat:"tops",label:"Regular Fit",art:"tee light"},
  {id:3,name:"Premium Hoodie",price:700,cat:"layers",label:"Everyday Layer",art:"hoodie"},
  {id:4,name:"Essential Jacket",price:700,cat:"layers",label:"Outerwear",art:"jacket"},
  {id:5,name:"Minimal Crop Top",price:300,cat:"tops",label:"Women's Edit",art:"crop"},
  {id:6,name:"Relaxed Joggers",price:650,cat:"bottoms",label:"Relaxed Fit",art:"pants"},
  {id:7,name:"Everyday Jeans",price:650,cat:"bottoms",label:"Denim",art:"jeans"}
];

let cart = JSON.parse(localStorage.getItem("chosenCart") || "[]");

const productsEl = document.getElementById("products");
const filters = document.getElementById("filters");

function money(n){ return "₹" + n.toLocaleString("en-IN"); }

function productCard(p){
  return `<article class="product">
    <div class="product-image">
      <div class="garment ${p.art}"></div>
    </div>
    <div class="product-info">
      <div class="product-cat">${p.label}</div>
      <div class="product-meta"><span class="product-name">${p.name}</span><span class="price">${money(p.price)}</span></div>
      <button class="add" data-add="${p.id}">Add to bag +</button>
    </div>
  </article>`;
}

function renderProducts(filter="all"){
  productsEl.innerHTML = products.filter(p=>filter==="all"||p.cat===filter).map(productCard).join("");
  productsEl.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>addToCart(+b.dataset.add)));
}
renderProducts();

filters.addEventListener("click",e=>{
  if(!e.target.dataset.filter)return;
  filters.querySelectorAll("button").forEach(b=>b.classList.remove("active"));
  e.target.classList.add("active");
  renderProducts(e.target.dataset.filter);
});

function save(){localStorage.setItem("chosenCart",JSON.stringify(cart));}
function addToCart(id){
  const p=products.find(x=>x.id===id);
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++; else cart.push({...p,qty:1});
  save(); renderCart(); openCart();
}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);save();renderCart();}
function renderCart(){
  document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
  const el=document.getElementById("cartItems");
  if(!cart.length){el.innerHTML='<p class="empty">Your bag is empty.</p>';}
  else el.innerHTML=cart.map(x=>`<div class="cart-row">
    <div class="mini-art"><div class="garment ${x.art}"></div></div>
    <div class="cart-row-info"><strong>${x.name}</strong><small>${money(x.price)} × ${x.qty}</small><button class="remove" data-remove="${x.id}">Remove</button></div>
  </div>`).join("");
  el.querySelectorAll("[data-remove]").forEach(b=>b.addEventListener("click",()=>removeFromCart(+b.dataset.remove)));
  document.getElementById("cartTotal").textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0));
}
renderCart();

const drawer=document.getElementById("cartDrawer"), overlay=document.getElementById("overlay");
function openCart(){drawer.classList.add("open");overlay.classList.add("open")}
function closeCart(){drawer.classList.remove("open");overlay.classList.remove("open")}
document.getElementById("cartBtn").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
overlay.onclick=closeCart;

const searchPanel=document.getElementById("searchPanel"), searchInput=document.getElementById("searchInput"), results=document.getElementById("searchResults");
document.getElementById("searchBtn").onclick=()=>{searchPanel.classList.add("open");setTimeout(()=>searchInput.focus(),200)};
document.getElementById("closeSearch").onclick=()=>searchPanel.classList.remove("open");
searchInput.addEventListener("input",()=>{
  const q=searchInput.value.toLowerCase().trim();
  const found=products.filter(p=>p.name.toLowerCase().includes(q)||p.label.toLowerCase().includes(q));
  results.innerHTML=(q?found:products).map(p=>`<div class="search-result"><span>${p.name}</span><strong>${money(p.price)}</strong></div>`).join("");
});
document.getElementById("newsletterForm").addEventListener("submit",e=>{
  e.preventDefault();document.getElementById("formMessage").textContent="You're on the list. Welcome to Chosen.";
});
document.getElementById("checkoutBtn").onclick=()=>alert("Demo checkout. Connect Razorpay/Stripe/UPI or your preferred payment gateway for live orders.");
document.getElementById("menuBtn").onclick=()=>document.querySelector(".nav-links").classList.toggle("mobile-open");
