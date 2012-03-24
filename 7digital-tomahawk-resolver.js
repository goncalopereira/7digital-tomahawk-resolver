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
        Tomahawk.addTrackResults( this.internalSearch( qid ) );
    },
    internalSearch: function( qid )
    {
        return {
            qid: qid,
            results: [
                {
                    artist: "Mokele",
                    album: "You Yourself are Me Myself and I am in Love",
                    track: "Hiding In Your Insides (js)",
                    source: "Mokele.co.uk",
                    url: "http://play.mokele.co.uk/music/Hiding%20In%20Your%20Insides.mp3",
                    bitrate: 160,
                    duration: 248,
                    size: 4971780,
                    score: 1.0,
                    extension: "mp3",
                    mimetype: "audio/mpeg"
                }
            ]

        };
    }
});

Tomahawk.resolver.instance = SevenDigitalResolver;
