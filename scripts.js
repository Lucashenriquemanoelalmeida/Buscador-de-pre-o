
const searchForm = document.querySelector('.search-form'); // Seleciona o formulário
const productlist = document.querySelector('.product-list');
const pricechart = document.querySelector('.price-chart'); // Corrigido para 'pricechart'

let mychart = null;

searchForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // Previne o envio do formulário

    // Seleciona o input e pega o valor digitado
    const inputValue = event.target.querySelector('.product-input').value;
    console.log(inputValue); // Exibe o valor no console (para testar)

    // Fazendo a requisição à API do Mercado Livre
    const data = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${inputValue}`);
    const products = (await data.json()).results.slice(0, 10);

    displayItems(products); // Exibe os produtos
    updatePriceChart(products); // Passa os produtos para a função de atualização do gráfico
});

function displayItems(products) {
    console.log(products);
    productlist.innerHTML = products.map(product => `
        <div class="product-card">
           <img src="${product.thumbnail}" alt="${product.title}">

            <h3>${product.title}</h3>
            <p>${product.price.toLocaleString('pt-br', { style: "currency", currency: "BRL" })}</p>
            <p>Loja: ${product.seller.nickname}</p>
        </div>
    `).join(''); // Adicionado .join('') para garantir que a string gerada seja válida
}

function updatePriceChart(products) {
    const ctx = pricechart.getContext('2d'); // Corrigido 'pricechat' para 'pricechart' e 'getcontext' para 'getContext'

    // Verifica se o gráfico já existe e o destrói antes de criar um novo
    if (mychart) {
        mychart.destroy();
    }

    // Criando o gráfico com as correções
    mychart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: products.map(product => product.title.substring(0, 20) + '...'),
            datasets: [{
                label: 'Preço (R$)',
                data: products.map(product => product.price),
                backgroundColor: 'rgba(46, 204, 113, 0.6)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1
            }]
        },
        options: { // Corrigido para 'options' com "o" minúsculo
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return 'R$ ' + value.toLocaleString('pt-br', {
                                style: 'currency',
                                currency: 'BRL', // Corrigido 'BLR' para 'BRL'
                            });
                        }
                    }
                }
            },
            plugins: { // Movido o 'plugins' para o nível correto
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Comparador de Preços',
                    font: {
                        size: 18
                    }
                }
            }
        }
    });
}
