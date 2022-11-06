let cart = [];
let modalqt = 1;
let modalKey = 0;

//essa função abaixo é para evitar repetir o comando queryselector a primeira normal e a segunda utilizando a funcao arrow
const c = function(el){
    return document.querySelector(el);
} 
const cs = (el)=>document.querySelectorAll(el);

//listagens das pizzas
pizzaJson.map((item,index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    
    pizzaItem.setAttribute('data-key',index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click',(e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalqt = 1;
        modalKey = key;

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--actualPrice').innerHTML = ` R$: ${pizzaJson[key].price.toFixed(2)}`
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size,sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

        });
        
        c('.pizzaInfo--qt').innerHTML = modalqt

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
        
    });

    c('.pizza-area').append(pizzaItem)
});

//Eventos do modal
function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
    c('.pizzaWindowArea').style.display = 'none';
    },500);
}
cs ('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click',closeModal)
})
//codigos abaixo sao os botaos de mais e menos com a funcao if para que nao fique 0 ou -1
c('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    if(modalqt>1){
    modalqt--;
    c('.pizzaInfo--qt').innerHTML = modalqt;
}
});
c('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalqt++;
    c('.pizzaInfo--qt').innerHTML = modalqt;
});
//the code below it is used to select only one option in the size menu.
cs('.pizzaInfo--size').forEach((size,sizeIndex)=>{
    size.addEventListener('click',(e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');    

    });
});
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id + '@' + size; //it is used to identify each pizza
    //this command below it is used to check if already exits a pizza so if exits it will only add the quantity otherwise it will creat another item in my array
    let key = cart.findIndex((item)=>item.identifier == identifier);
    if (key > -1){
        cart[key].qt += modalqt;
    } else{    
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalqt
        });
    }
    updateCart();
    closeModal();
    
});

c('.menu-openner').addEventListener('click',()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click',()=>{
    c('aside').style.left = '100vw'
});


function updateCart(){

    c('.menu-openner span').innerHTML = cart.length;
    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let discount = 0;
        let total = 0;

        for (let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id==cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartitem = c('.models .cart--item').cloneNode(true);
            
            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;   
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartitem.querySelector('img').src = pizzaItem.img;
            cartitem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartitem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartitem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if (cart[i].qt >1){
                        cart[i].qt--;
                } else{
                    cart.splice(i, 1);
                }
                    updateCart();            
            });
            cartitem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt ++;
                updateCart();
            })
            c('.cart').append(cartitem);    
        }
    
        desconto = subtotal*0.1;
        total = subtotal - desconto;

            c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
            c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
            c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
        
            
    }else{
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw'
    }
};