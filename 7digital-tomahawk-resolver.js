var SevenDigitalResolver = Tomahawk.extend(TomahawkResolver,
{
	settings: {name: '7digital Previews Resolver',weight: 100,timeout: 5},
	resolve: function( qid, artist, album, title )
	{
        	return Tomahawk.addTrackResults( this.internalSearch( qid ) );
	},
	search: function( qid, searchString )
	{
		var sdUrl = 'http://api.7digital.com/1.2/track/search?q=' + searchString +'&oauth_consumer_key=musichackday';
		this.executeSearchQuery(qid, sdUrl);
	},
	parseTrack : function(track)
	{
		var id = track.attributes[0].value;
		Tomahawk.log( "http://api.7digital.com/1.2/track/preview?trackid=" + id + "&oauth_consumer_key=musichackday");

		return {
			artist: track.childNodes[2].childNodes[0].textContent,
			album: track.childNodes[8].childNodes[0].textContent,
			track: track.childNodes[0].textContent,
			albumpos: track.childNodes[3].textContent, //should work but not on my current version 0.4.0
			source: this.settings.name,
			//   size: this.getXmlAttribute("size", song_attributes), //get from header..
			duration: 30, //track.childNodes[4].textContent, //thats actual track duration not preview..
			// bitrate: this.getXmlAttribute("bitRate", song_attributes), //not available, aproximate duration with size????
			url: "http://api.7digital.com/1.2/track/preview?trackid=" + id + "&oauth_consumer_key=musichackday",
			extension: "mp3",//get from header..
			// year: this.getXmlAttribute("year", song_attributes)
			mimeType: "audio/mpeg", //get from header..
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

			for (var count = 3; count < search_results.length; count++) //ignore paging nodes
			{
				results.push(that.parseTrack(search_results[count].childNodes[1]));
			}

			var return_songs = {qid: qid, results: results };
			Tomahawk.addTrackResults(return_songs);
		 });
    	}
});

Tomahawk.resolver.instance = SevenDigitalResolver;
