
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();

    $greeting.text('So, you want to visit '+streetStr+', '+cityStr+'?');

    // Google Street View API
    $body.append('<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x300&location='+streetStr+', '+cityStr+'" >');
    
    // NY Times API
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
      'api-key': "1e5fa99cbb5f47ddb876d4ab45b6039c",
      'q': cityStr,
      'sort': "newest"
    });
    $.ajax({
      url: url,
      method: 'GET',
    }).done(function(result) {
        $nytHeaderElem.text('NYT articles about '+cityStr);
        articles = result.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article"><a href="'+article.web_url+'">'+article.headline.main+'</a><p>'+article.snippet+'</p></li>');
        };
      console.log(result);
      console.log(articles);
    }).fail(function() {
      $nytHeaderElem.text('NYT articles colud not be displayed.');
    });

    // Wikipedia API 
    var wikiurl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+cityStr+'&format=json&callback=wikicallback';
    
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Failed to get Wikipedia resources");
    }, 8000);

    $.ajax( {
        url: wikiurl,
        dataType: 'jsonp',
        type: 'POST',
        headers: { 'Api-User-Agent': 'Example/1.0' },
        success: function(data) {
            links = data[1];
            for (var i=0;i<links.length;i++){
                var link = links[i];
                $wikiElem.append('<li><a href="https://en.wikipedia.org/wiki/'+link+'">'+link+'</a></li>')
            };
            clearTimeout(wikiRequestTimeout);
            console.log(data);
            console.log(links);
        }
    } );

    return false;
};

$('#form-container').submit(loadData);
