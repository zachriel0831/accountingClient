module.exports = {
    AjaxTimeOut: 6000,
    mode: 1 , //0 local, 1 dev
    defaultLanguage: 'zh-TW',
    routersData: ['/Home', '/Charts', '/Details', '/Installment', '/Currency','/Stocks','/BackUp'],
    categories: ['foods', 'entertaining', 'travel', 'home', 'bills', 'rental', 'education', 'social', 'saving', 'tax', 'medical', 'gifts', 'insurance', 'credit_card', 'stock', 'salary', 'loan', 'interests', 'unexpected', 'other'],
    backEndUrl: 'https://arcane-chamber-15160.herokuapp.com',
    crawlerService:'https://zachriel-accountting.herokuapp.com/',
    localTestUrl:'http://localhost:8080/',
    crawlingLocalService: 'http://localhost:5000/'

};
