const requestPro = require('request-promise');
const cheerio = require('cheerio');
const amazon = require('amazon-product-api');

const getNumber = function(review){
    let match = review.match(/\d+(?:\.\d+)?/g);
    return match ? match[0] : 0;
}

const webCrawler = function (url) {

    const options = {
        uri: url,
        transform: function (body) {
            return cheerio.load(body);
        },
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36'
        },
        gzip: true
    };

    let results =  requestPro(options)
        .then(function (jQuery) {
            let review = jQuery("img[align='absbottom']").attr('alt');
            if(review)
                return getNumber(review);
            else return 0;
        })
        .catch(function (err) {
            console.error(err);
            results = err;
        });

    return results;
}

const client = amazon.createClient({
    awsId: "AKIAIXL2CZWKN3TYZTEA",
    awsSecret: "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",
    awsTag: "tagflixuk-21",
});
 

exports.handler = function(event, context, callback) {
    //const id = event.productId;
    const id = "B07HH9P7B9";
    
    client.itemLookup({
        idType: 'ASIN',
        itemId: id || 'B07HH9P7B9',
        domain: 'webservices.amazon.co.uk',
        responseGroup: 'ItemAttributes,Offers,Images,Reviews'
    }).then(function (results) {
    
        const reviewUrl = results[0].CustomerReviews[0].IFrameURL[0];
        const ratingPromise = webCrawler(reviewUrl);
        ratingPromise.then((response) => {
            //const price = parseFloat(results[0].ItemAttributes[0].ListPrice[0].FormattedPrice[0]);
            const price = getNumber(results[0].OfferSummary[0].LowestNewPrice[0].FormattedPrice[0]);
            const resObject = {
                merchant: "AMAZON",
                title   : results[0].ItemAttributes[0].Title[0],
                price   : parseFloat(price),
                currency: results[0].ItemAttributes[0].ListPrice[0].CurrencyCode[0],
                seller_name: results[0].ItemAttributes[0].Publisher[0],
                rating  : response || 0,
                img_url : results[0].LargeImage[0].URL[0],
                aff_link: results[0].DetailPageURL[0],
                product_id : id,
                tagflix_id: "TAG001",
            }
            const responseObject = {
                statusCode: 200,
                headers: { "Content-type": "application/json" },
                body: JSON.stringify( resObject )
              };

            //callback(null, responseObject); 
        });
    
    }).catch(function (err) {
        //callback(err, null)
    });    

    const responseObject = {
        statusCode: 200,
        headers: { "Content-type": "application/json" },
        body: JSON.stringify( "body" )
      };
    callback(null, responseObject); 
}