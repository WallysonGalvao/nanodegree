# Module responsible for opening a browser.
import webbrowser


# Creating the Movie class that will provide attributes and behaviors
class Movie:
    """ This class provides a way to store movie related information """

    # Function that defines the attributes of Movie's class.
    def __init__(self, title, poster_img_url, trailer_url):
        """This function will be used for instantiation. The arguments will
                be stored inside methods that will be used by objects.
        Args:
            self: the object itself.
            title: A string containing the movie's title.
            poster_img_url: A string containing the URL of a poster.
            trailer_url: A string containing a URL from a YouTube video.
        """
        self.title = title
        self.poster_img_url = poster_img_url
        self.trailer_url = trailer_url

    # Function responsible for opening the trailer.
    def show_trailer(self):
        webbrowser.open(self.trailer_url)
