from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database_setup import Restaurant, Base, MenuItem, User

# engine = create_engine('sqlite:///restaurantmenu.db')
engine = create_engine('sqlite:///restaurantmenu.db',
                       connect_args={'check_same_thread': False})
# Bind the engine to the metadata of the Base class so that the
# declaratives can be accessed through a DBSession instance
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
# A DBSession() instance establishes all conversations with the database
# and represents a "staging zone" for all the objects loaded into the
# database session object. Any change made against the objects in the
# session won't be persisted into the database until you call
# session.commit(). If you're not happy about the changes, you can
# revert all of them back to the last commit by calling
# session.rollback()
session = DBSession()

# Create dummy user
User1 = User(name="Wallyson Galvão", email="wallyson.galvao@gmail.com")
session.add(User1)
session.commit()

# Menu Giraffas
restaurant1 = Restaurant(name="Giraffas", user_id="1")

session.add(restaurant1)
session.commit()

menuItem1 = MenuItem(name="Camarão com Molho Especial",
                     description="""Spaghettini ao molho especial Giraffas 
                     e 120g de camarão.""",
                     price="R$20.99", restaurant=restaurant1, user_id=1)

session.add(menuItem1)
session.commit()

menuItem2 = MenuItem(name="Iscas de Filé Mignon com Molho de Ervas com Alho",
                     description="""Spaghettini ao molho de ervas com alho e 
                     110g de iscas de carne.""",
                     price="R$17.50",  restaurant=restaurant1, user_id=1)

session.add(menuItem2)
session.commit()


menuItem3 = MenuItem(name="Iscas de Peito de Frango com Molho ao Sugo",
                     description="""Spaghettini ao molho sugo e 120g de 
                     iscas de frango.""",
                     price="R$15.50", restaurant=restaurant1, user_id=1)

session.add(menuItem3)
session.commit()


# Menu Coco Bambu Restaurante
restaurant2 = Restaurant(name="Coco Bambu Restaurante")

session.add(restaurant2)
session.commit()


menuItem1 = MenuItem(name="Tilápia Pescador",
                     description="""Filé de Tilápia grelhado com cebolas, 
                     alcaparras e salsinha. Acompanha arroz de alho e 
                     batata soutê.""",
                     price="R$70.99", restaurant=restaurant2)

session.add(menuItem1)
session.commit()

menuItem2 = MenuItem(name="Peixe c/ Crosta de Pão",
                     description="""Filet de peixe com crosta crocante 
                     de pão, acompanha talharim à alho e óleo, e legumes.""",
                     price="R$25.00",  restaurant=restaurant2)

session.add(menuItem2)
session.commit()

menuItem3 = MenuItem(name="Peixe à Dorê",
                     description="""Filé de peixe empanado, acompanha 
                     anéis de cebola empanados, arroz branco e 
                     batata gratinada.""",
                     price="R$15.00", restaurant=restaurant2)

session.add(menuItem3)
session.commit()


print("Itens adicionados!")
