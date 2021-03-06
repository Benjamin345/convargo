'use strict';

//list of truckers
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const truckers = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'les-routiers-bretons',
  'pricePerKm': 0.05,
  'pricePerVolume': 5
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'geodis',
  'pricePerKm': 0.1,
  'pricePerVolume': 8.5
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'xpo',
  'pricePerKm': 0.10,
  'pricePerVolume': 10
}];

//list of current shippings
//useful for ALL steps
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const deliveries = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'shipper': 'bio-gourmet',
  'truckerId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'distance': 100,
  'volume': 4,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'shipper': 'librairie-lu-cie',
  'truckerId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'distance': 650,
  'volume': 12,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'shipper': 'otacos',
  'truckerId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'distance': 1250,
  'volume': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'deliveryId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}];

var i;
var j;
var k;
var shippingPrice=0;
var deductibleReduction=0;
var commission;
var insurance;
var treasury;

for( i=0;i<deliveries.length;i++)
{
  for( j=0;j<truckers.length;j++)
  {
    if(truckers[i]['id']==deliveries[j]['truckerId'])
    {
      shippingPrice=deliveries[i]['distance']*truckers[j]['pricePerKm']+deliveries[i]['volume']*truckers[j]['pricePerVolume'];
      deliveries[i]['price']=shippingPrice;
    }

    if(deliveries[i]['volume']>=5 && deliveries[i]['volume']<10)
       deliveries[i]['price']= deliveries[i]['price'] - (deliveries[i]['price']*10)/100;

    if(deliveries[i]['volume']>=10 && deliveries[i]['volume']<25)   
      deliveries[i]['price']= deliveries[i]['price'] - (deliveries[i]['price']*30)/100;

    if(deliveries[i]['volume']>=25)
      deliveries[i]['price']= deliveries[i]['price'] - (deliveries[i]['price']*50)/100;

    commission=shippingPrice*30/100;
    insurance=commission/2;
    treasury=deliveries[i]['distance']/500;
    deliveries[i]['commission']['insurance']=insurance;
    deliveries[i]['commission']['treasury']=treasury;
    deliveries[i]['commission']['convargo']=commission-(insurance + treasury);

    if (deliveries[i]['deductibleReduction'] == true)
    {
        deductibleReduction=deliveries[i]['volume'];
        deliveries[i]['price']+=deliveries[i]['volume'];
    }

    for( i=0;i<actors.length;i++)
    {
      for( j=0;j<deliveries.length;j++)
      {
        if(actors[i]['deliveryId']=deliveries[j]['id'])
        {
          actors[i]['payment'][0]['amount']=shippingPrice+deductibleReduction;
          actors[i]['payment'][1]['amount']=shippingPrice - commission;
          actors[i]['payment'][2]['amount']= insurance;
          actors[i]['payment'][3]['amount']= treasury;
          actors[i]['payment'][4]['amount']= commission-(insurance + treasury)+ deductibleReduction;
        }
      }
    }
  }
}

console.log(truckers);
console.log(deliveries);
console.log(actors);
