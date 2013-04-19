/**
 * Wrapper around the Last.FM API.
 */
function LastFM() {
    this.apiKey = "26fd5c4e94f30e7a0f2489b2c5babb61";
}

/**
 * Gets the 5 most popular tags for an artist.
 */
LastFM.prototype.getTags = function(artist, callback) {
    var url = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=" + artist + "&api_key=" + this.apiKey + "&format=json&callback=?";
    
    var handler = function(response) {
        var tags = [];
        
        if (response && response.toptags && response.toptags.tag) {            
            var topTags = response.toptags.tag;            
            var length = Math.min(5, topTags.length);
            for (i = 0; i < length; i++) {
                tags.push(topTags[i].name);
            }
        }
        
        callback(tags);
    }
    
    $.ajax({
      url: url,
      dataType: 'json',
      success: handler,
      error: function() { callback([]); }
    });        
}