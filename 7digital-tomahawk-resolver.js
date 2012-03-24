var SevenDigitalResolver = Tomahawk.extend(TomahawkResolver,
{
    settings:
    {
        name: '7digital Resolver',
        weight: 100,
        timeout: 5
    },
    resolve: function( qid, artist, album, title )
    {
        return Tomahawk.addTrackResults( this.internalSearch( qid ) );
    },
    search: function( qid, searchString )
    {

var sdUrl = 'http://api.7digital.com/1.2/track/search?q=' + searchString +'&oauth_consumer_key=musichackday';

//	this.executeSearchQuery(qid, 'http://localhost:4567/track/search'); //local stub for when connection is shit, integration
this.executeSearchQuery(qid, sdUrl);

    },

    getXmlAttribute: function(attrib_name, attributes) {
        for (var count = 0; count < attributes.length; ++count)
        {
            if (attrib_name === attributes[count].nodeName)
                return attributes[count].nodeValue;
        }
        return null;
    },

	parseTrack : function(track, scoreValue)
    {
	var id = track.attributes[0].value;

        return {
            artist: track.childNodes[2].childNodes[0].textContent,
            album: track.childNodes[8].childNodes[0].textContent,
            track: track.childNodes[0].textContent,
           albumpos: track.childNodes[3].textContent,
            source: this.settings.name,
         //   size: this.getXmlAttribute("size", song_attributes), //get from header..
            duration: track.childNodes[4].textContent,
           // bitrate: this.getXmlAttribute("bitRate", song_attributes), //not available, aproximate duration with size????
            url: "http://api.7digital.com/1.2/track/preview?trackid=" + id + "&oauth_consumer_key=musichackday",
            extension: "mp3",//get from header..
           // year: this.getXmlAttribute("year", song_attributes)

		score: scoreValue,
		mimeType: "audio/mpeg" //get from header..
        };
    },
    executeSearchQuery : function(qid, search_url)
    {
        var results = [];
        var that = this; // needed so we can reference this from within the lambda

        Tomahawk.asyncRequest(search_url, function(xhr) {
		var dom_parser = new DOMParser();
		xmlDoc = dom_parser.parseFromString(xhr.responseText, "text/xml");

		var search_results = xmlDoc.childNodes[0].childNodes[0].childNodes;


Tomahawk.log(search_results.length);

	   for (var count = 3; count < search_results.length; count++)
            {
                results.push(that.parseTrack(search_results[count].childNodes[1], 1));
            }

            var return_songs = {
                qid: qid,
                results: results
            };

            Tomahawk.addTrackResults(return_songs);
        });
    }
});

Tomahawk.resolver.instance = SevenDigitalResolver;
