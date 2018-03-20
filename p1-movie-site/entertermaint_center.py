import media
import fresh_tomatoes

guardians_of_galaxy_1 = media.Movie("Guardians of the Galaxy 1", "The new Marvel movie comes full of action and adventure. Do not miss it!",
                                    "https://upload.wikimedia.org/wikipedia/pt/b/b2/Guardiansgalaxyposter.jpg", "https://www.youtube.com/watch?v=d96cjJhvlMA")

guardians_of_galaxy_2 = media.Movie(" Guardians of the Galaxy 2", "The Guardians must fight to keep their newfound family toether as they unravel the mystery of Peter Quill's true parentage.",
                                    "http://i.annihil.us/u/prod/marvel/html_pages_assets/gotg2-premiere/images/master_gotg2-b3de7b1c93.jpg", "https://www.youtube.com/watch?v=2LIQ2-PZBC8")

infinity_war = media.Movie("Avengers: Infinity War", "As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos.",
                           "http://media.comicbook.com/2018/03/avengers-infinity-war-poster-1093756.jpeg", "https://www.youtube.com/watch?v=6ZfuNTqbHE8&t=27s")

movies = [guardians_of_galaxy_1, guardians_of_galaxy_2, infinity_war]
fresh_tomatoes.open_movies_page(movies)
