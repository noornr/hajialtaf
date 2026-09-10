const items=[
  ["Full Chicken Fry",480,"https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=700&q=80"],
  ["Half Chicken Fry",240,"https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=700&q=80"],
  ["Chest Pcs",140,"https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=700&q=80"],
  ["Leg Pcs",120,"https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=700&q=80"],
  ["Chicken Pakoda",120,"https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80"],
  ["Chicken Kabab",140,"https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80"],
  ["Chicken Lollipop",140,"https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=700&q=80"],
  ["Chicken Khima",80,"https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=700&q=80"],
  ["Apollo Fish Rost",200,"https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?auto=format&fit=crop&w=700&q=80"],
  ["Mutton Boti",80,"https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80"],
  ["Mutton Paya",120,"https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80"],
  ["Rumali Roti",20,"https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=700&q=80"]
];
let cart={};

const grid=document.getElementById("menuGrid");
grid.innerHTML=items.map((x,i)=>`
  <article class="menu-card" onclick="addToCart(${i})">
    <div class="card-img" style="background-image:url('${x[2]}')"></div>
    <h3>${x[0]}</h3><div class="price">₹${x[1]}</div>
  </article>`).join("");

function addToCart(i){cart[i]=(cart[i]||0)+1;openOrder();}
function openOrder(){
  document.getElementById("orderModal").classList.add("show");
  renderCart();
}
function closeOrder(){document.getElementById("orderModal").classList.remove("show")}
function renderCart(){
  const box=document.getElementById("cartItems");
  const selected=Object.keys(cart).filter(k=>cart[k]>0);
  if(!selected.length){box.innerHTML='<p style="color:#aaa;font-size:11px">Select an item from the menu to add it to your order.</p>'}
  else box.innerHTML=selected.map(k=>`
    <div class="cart-row">
      <span>${items[k][0]} × ${cart[k]}</span>
      <span>₹${items[k][1]*cart[k]}
      <span class="qty"><button onclick="changeQty(${k},-1)">−</button><button onclick="changeQty(${k},1)">+</button></span></span>
    </div>`).join("");
  document.getElementById("total").textContent=selected.reduce((s,k)=>s+items[k][1]*cart[k],0);
}
function changeQty(i,d){cart[i]=(cart[i]||0)+d;if(cart[i]<=0)delete cart[i];renderCart()}
function sendOrder(){
  const selected=Object.keys(cart).filter(k=>cart[k]>0);
  if(!selected.length){alert("Please select at least one item.");return}
  const text="Hello Haji Althaf! I want to order:%0A"+selected.map(k=>`${items[k][0]} x ${cart[k]} = ₹${items[k][1]*cart[k]}`).join("%0A")+`%0A%0ATotal: ₹${selected.reduce((s,k)=>s+items[k][1]*cart[k],0)}`;
  window.open("https://wa.me/919876543210?text="+text,"_blank");
}
document.querySelector(".menu-toggle").addEventListener("click",()=>document.querySelector(".nav").classList.toggle("open"));
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".nav").classList.remove("open")));
document.getElementById("orderModal").addEventListener("click",e=>{if(e.target.id==="orderModal")closeOrder()});
