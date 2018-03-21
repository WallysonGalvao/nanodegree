# Media module is necessary to create new instances
from media import Movie
# Fresh_tomatoes module is necessary to open the website
import fresh_tomatoes

# Creating instances based on the class Movie.
guardians_of_galaxy_1 = Movie("Guardians of the Galaxy 1",
                              "https://upload.wikimedia.org/wikipedia/pt/b/b2/Guardiansgalaxyposter.jpg",
                              "https://www.youtube.com/watch?v=d96cjJhvlMA")

guardians_of_galaxy_2 = Movie("Guardians of the Galaxy 2",
                              "http://i.annihil.us/u/prod/marvel/html_pages_assets/gotg2-premiere/images"
                              "/master_gotg2-b3de7b1c93.jpg",
                              "https://www.youtube.com/watch?v=2LIQ2-PZBC8")

infinity_war = Movie("Avengers: Infinity War",
                     "http://media.comicbook.com/2018/03/avengers-infinity-war"
                     "-poster-1093756.jpeg",
                     "https://www.youtube.com/watch?v=6ZfuNTqbHE8&t=27s")
# Add objects to a list.
movies = [guardians_of_galaxy_1, guardians_of_galaxy_2, infinity_war]

# Calling the function that opens the website.
fresh_tomatoes.open_movies_page(movies)
