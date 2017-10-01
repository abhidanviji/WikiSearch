//Pop-up for Read More option
function articleInfo(content, title, lastUsed) {
    var win = window.open('', '', 'width=800,height=400,top=50,left=250,resizeable,scrollbars');
    var doc = '<title>LimoSys Wiki Article View</title><h2>' + title.replace(/`/g, "'") + '</h2><br>' + content.replace(/`/g, "'") + '<br> \
	<p><h3>Article Last Modified: ' + new Date(lastUsed) + '</h3></p><br><br><a href=\"http://en.wikipedia.org/wiki/' + title + '\">View Full Article</a>';
    win.document.write(doc);
}

//Main function which gets called on each key stroke
function wikiSearch() {
    var cont = document.getElementById('container');
    cont.style.display = 'block';
    var output = '',
        imgUrl = '';
    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php',
        dataType: 'jsonp',
        data: {
            action: 'query',
            format: 'json',
            generator: 'search',
            gsrsearch: $("#txt").val(),
            gsrnamespace: 0,
            gsrlimit: 10,
            prop: 'extracts|pageimages|pageterms|info',
            exchars: 200,
            exlimit: 'max',
            explaintext: true,
            exintro: true,

            piprop: 'thumbnail',
            pilimit: 'max',
            pithumbsize: 200
        },
        success: function(json) {
            var results = json.query.pages;
            $.map(results, function(result) {
                var actualContent = result.extract.replace(/'/g, "`").replace(/"/g, "`");
                var actualTitle = result.title.replace(/'/g, "`");
                var desc = '';
                output += '<div><h2>' + result.title + '</h2>';
                if (result.thumbnail) {
                    imgUrl = result.thumbnail.source;
                } else {
                    imgUrl = './images/noimage.png';
                }
                try {
                    if (result.terms.description["0"]) {
                        desc = result.terms.description["0"];
                    }
                } catch (err) {
                    desc = result.extract.substring(0, 50) + '...';
                }
                output += '<table><tr><td class="imgtd"><img src="' + imgUrl + '" height="50" width="50"/></td><td class="desctd"><p>' + desc + ' <a href="javascript:articleInfo(\'' + actualContent + '\',\'' + actualTitle + '\',\'' + result.touched + '\')">Read more</a></p></td></tr></table>';
                output += '<hr></div>'
            });
            document.getElementById('articles').innerHTML = output;

        }
    });

}
