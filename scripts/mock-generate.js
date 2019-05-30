var faker = require('faker');
var fs = require('fs');

const sectors = ['Healthcare', 'Utilities', 'Telecom', 'AI', 'Energy'];
let mockData = [];

for(let i = 0; i <= 100; i++) {
  mockData.push({
    isin: faker.helpers.replaceSymbols('??##########'),
    currency: faker.finance.currencyCode(),
    amount: faker.finance.amount(),
    sector: sectors[Math.floor(Math.random() * sectors.length)],
  })
}
fs.writeFile('mock-data.json', JSON.stringify(mockData, null, 4), 'utf8', (e) => console.log('e :', e));
