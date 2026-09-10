const products=[
 ["Full Chicken Fry",480,"assets/menu-1.jpg"],
 ["Half Chicken Fry",240,"assets/menu-2.jpg"],
 ["Chest Pcs",140,"assets/menu-3.jpg"],
 ["Leg Pcs",120,"assets/menu-4.jpg"],
 ["Chicken Pakoda",120,"assets/menu-5.jpg"],
 ["Chicken Kabab",140,"assets/menu-6.jpg"],
 ["Chicken Lollipop",140,"assets/menu-7.jpg"],
 ["Chicken Khima",80,"assets/menu-8.jpg"],
 ["Apollo Fish Rost",200,"assets/menu-9.jpg"],
 ["Mutton Boti",80,"assets/menu-10.jpg"],
 ["Mutton Paya",120,"assets/menu-11.jpg"],
 ["Rumali Roti",20,"assets/menu-12.jpg"]
];

let cart={};

function renderMenu(){
 const grid=document.getElementById("menuGrid");
 grid.innerHTML=products.map((p,i)=>`
   <article class="menu-card" onclick="addToCart(${i})">
     <img src="${p[2]}" alt="${p[0]}">
     <h3>${p[0]}</h3>
     <div class="price">₹${p[1]}</div>
   </article>`).join("");
}
function addToCart(i){cart[i]=(cart[i]||0)+1;openOrder()}
function openOrder(){document.getElementById("orderModal").classList.add("show");renderCart()}
function closeOrder(){document.getElementById("orderModal").classList.remove("show")}
function renderCart(){
 const box=document.getElementById("cartItems");
 const selected=Object.keys(cart).filter(k=>cart[k]>0);
 if(!selected.length){
   box.innerHTML='<div style="color:#aaa;font-size:10px;padding:8px 0">Select a dish from the menu to add it to your order.</div>';
 }else{
   box.innerHTML=selected.map(k=>`
    <div class="cart-row">
      <span>${products[k][0]} × ${cart[k]}</span>
      <span>₹${products[k][1]*cart[k]}
        <span class="qty"><button onclick="changeQty(${k},-1)">−</button><button onclick="changeQty(${k},1)">+</button></span>
      </span>
    </div>`).join("");
 }
 const total=selected.reduce((s,k)=>s+products[k][1]*cart[k],0);
 document.getElementById("cartTotal").textContent=total;
}
function changeQty(i,d){cart[i]=(cart[i]||0)+d;if(cart[i]<=0)delete cart[i];renderCart()}
function sendWhatsApp(){
 const selected=Object.keys(cart).filter(k=>cart[k]>0);
 if(!selected.length){alert("Please select at least one item.");return}
 const total=selected.reduce((s,k)=>s+products[k][1]*cart[k],0);
 const text="Hello Haji Althaf! I want to order:%0A"+selected.map(k=>`${products[k][0]} x ${cart[k]} = ₹${products[k][1]*cart[k]}`).join("%0A")+`%0A%0ATotal: ₹${total}`;
 window.open("https://wa.me/919876543210?text="+text,"_blank");
}
function scrollToId(id){document.getElementById(id)?.scrollIntoView({behavior:"smooth"})}
document.getElementById("mobileToggle").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("open"));
document.querySelectorAll(".main-nav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("open")));
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
 document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
}));
document.getElementById("orderModal").addEventListener("click",e=>{if(e.target.id==="orderModal")closeOrder()});
renderMenu();
