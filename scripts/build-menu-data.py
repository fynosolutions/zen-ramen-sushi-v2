"""Transcribed from user-supplied menu PDF page renders. No calculated card prices."""
from pathlib import Path
from decimal import Decimal
import json, re, copy

ROOT = Path(__file__).resolve().parent.parent
FILES = {'dinner':'ZEN NOODLE DINNER MENU-01.pdf','lunch':'ZEN NOODLE Lunch II takeout-2023-04-01.pdf','happy-hour':'zen noodle happy hour menu final print-02.pdf'}
menus={key:{'id':key,'label':label,'pdf':f'/menus/{key}.pdf','sections':[]} for key,label in [('dinner','Dinner'),('lunch','Lunch'),('happy-hour','Happy Hour')]}
def cents(v): return int(Decimal(v)*100) if v else None
def section(menu,title,page,rows,notes=None):
 items=[]
 for row in rows.strip().splitlines():
  if not row.strip(): continue
  parts=row.split('|'); parts += ['']*(4-len(parts))
  name,cash,card,description=parts[:4]
  items.append({'id':f'{menu}-{len(menus[menu]["sections"])}-{len(items)}','name':name.strip(),'cashCents':cents(cash.strip()),'cardCents':cents(card.strip()),'description':description.strip(),'source':{'file':FILES[menu],'page':page},'reviewStatus':'visually-transcribed'})
 value={'id':re.sub(r'[^a-z0-9]+','-',title.lower()).strip('-'),'title':title,'notes':notes or [],'items':items}
 menus[menu]['sections'].append(value)
 return value
sub2='Substitution politely declined. Any changes will be a minimum of $2.00 (based on cash price) and up.'
sub3='Substitution politely declined. Any changes will be a minimum of $3.00 (based on cash price) and up.'
section('dinner','Appetizers',2,'''
Fried Oyster (4 pcs)|10.99|11.43|
Reg. Edamame|8.99|9.35|Steamed young soy bean with sea salt.
Garlic Edamame|10.99|11.43|Sriracha, garlic and sugar. Spicy.
Shishito Pepper|13.99|14.55|Charred Japanese peppers with orange zest & sweet miso.
Steam Bun (1 pc)|8.99|9.35|Choice of grilled chicken or pork belly, with romaine lettuce, scallions, seaweed salad, Kewpie mayo.
Takoyaki|11.99|12.47|Octopus ball made with Kewpie mayo, bonito flakes & scallions.
Shumai (6 pcs)|10.99|11.43|Fried shrimp shumai.
Gyoza (6 pcs)|10.99|11.43|Pan fried pork dumpling.
Karaage with Sesame Seed|10.99|11.43|Japanese style fried boneless dark meat chicken, spicy mayo dip.
Rock Shrimp|14.99|15.59|Crispy fried shrimp with spicy mayo.
Crispy Wings|13.99|14.55|Deep fried chicken wings.
69 Shrimp (5 pcs)|14.99|15.59|Deep fried shrimp with pops.
Potato Shrimp|14.99|15.59|Crispy fried with Kewpie dipping.
Ika Yaki|16.99|17.67|Grilled whole squid.
Vegetable Gyoza (6 pcs)|11.99|12.47|Pan fried vegetable dumpling.
''',[sub2])
section('dinner','Appetizers from Sushi Bar',2,'''
Cucumbers Salad|6.99|7.27|Marinated cucumbers in wasabi yuzu sauce.
Seaweed Salad|8.99|9.35|Green Japanese seaweed with sesame seeds.
Spicy Tuna Cracker|16.99|17.67|Wasabi crackers with spicy tuna, tobiko, jalapeño on top.
Seared Trio|16.99|17.67|Seared pepper tuna with yuzu, seared salmon with yuzu, seared white tuna with ponzu.
Kani Salad|8.99|9.35|Japanese crab stick, cucumber, Kewpie mayo, sesame seeds.
Trio Tartare|16.99|17.67|Freshly diced tuna, salmon & yellowtail with avocado, yuzu sauce & mango sauce.
Salmon Carpaccio|16.99|17.67|Thin slice salmon with truffle lime dressing.
Yellow Tail Serrano|17.99|18.71|Thin slice yellowtail with serrano peppers & ponzu sauce.
Garden Green Salad|9.99|10.39|Organic mesclun, tomatoes with romaine lettuce, roasted sesame dressing.
''',[sub2])
section('dinner','Hot Soup',2,'Miso Soup|3.99|4.13|\nTom Yum Soup|7.99|8.31|')
section('dinner','Sides',2,'''
White Rice|2.99|3.11|
Brown Rice|2.99|3.11|
Sushi Rice|3.99|4.15|
Spicy Mayo|2|2.08|
Eel Sauce|2|2.08|
Teriyaki Sauce|2|2.08|
Ginger Dressing|2|2.08|
Mango Sauce|3|3.12|
Home Made Spicy Paste|3|3.12|
''')
section('dinner','Sushi Rolls',3,'''
AAC|7.99|8.31|Avocado, cucumber, asparagus.
Alaska Roll|8.99|9.35|Salmon, avocado, cucumber.
Amazing Tuna|20.99|21.83|Spicy tuna & white tuna tempura topped with seared black pepper tuna.
Boston Roll|7.99|8.31|Shrimp, lettuce, mayo.
Black Dragon|19.99|20.79|Shrimp tempura inside, topped with eel & avocado.
California|6.99|7.27|
Dragon|18.99|19.75|Eel cucumber inside, avocado on top with sesame seeds.
Rainbow|18.99|19.75|Crab stick, avocado & cucumber inside, topped with tuna, salmon, yellowtail & white fish.
Salmon Roll|7.49|7.79|
Salmon Avocado Roll|8.99|9.35|
Salmon Cucumber Roll|7.99|8.31|
Spicy Tuna (Crunch) Roll|8.99|9.35|
Spicy Salmon (Crunch) Roll|8.99|9.35|
Spicy Yellow Tail (Crunch) Roll|8.99|9.35|
Shrimp Cucumber Roll|7.99|8.31|
Shiitake Mushroom Roll|6.99|7.27|
Shrimp & Avocado Roll|7.99|8.31|
Sweet Potato Roll|6.99|7.27|
Shrimp Tempura Roll|14.99|15.59|
Spider Roll|16.99|17.67|Soft shell crab, cucumber, avocado, tobiko.
Tempura Purple Yam Roll|7.99|8.31|
Triple Crab|20.99|21.83|Soft shell crab, cucumber & avocado topped with stone crab & spicy snow crab.
Tuna Roll|8.99|9.35|
Tuna Avocado Roll|9.49|9.87|
Tuna Cucumber Roll|9.49|9.87|
Volcano|20.99|21.83|Salmon, white tuna inside then fried, topped with spicy tuna.
Yellow Tail Scallion Roll|7.49|7.79|
Yellowtail Jalapeno Roll|7.49|7.79|
Eel Roll|8.49|8.83|
Eel Cucumber Roll|8.99|9.35|
Eel Avocado Roll|8.99|9.35|
Golden Buddha|18.99|19.75|Shrimp tempura topped with lobster salad & mango.
Manhattan Roll|18.99|19.75|Shrimp tempura inside, topped with spicy crunchy tuna.
Oshiko Roll|6.99|7.27|
Philadelphia|8.99|9.35|
''',['Brown rice addition $1 (based on cash price).'])
rollnote='All rolls can be made with brown rice or soybean paper by request. Additional $1 (based on cash price) for each item.'
section('dinner','Special Roll',3,'''
Crazy Yellowtail Roll|19.99|20.79|Avocado, cucumber, masago, topped with yellowtail, jalapeño & chili sauce.
Dancing Rock Shrimp Roll|19.99|20.79|Rock shrimp tempura topped with lobster salad, caviar & eel sauce.
Dynamite Roll|18.99|19.75|Tuna, salmon, avocado, cucumber, mango inside, spicy crab meat & tobiko on top.
Fantasy Roll|20.99|21.83|Spicy tuna crunch, avocado inside, topped with spicy crab.
King Kong Roll|20.99|21.83|Shrimp tempura, spicy tuna, lobster salad, topped with avocado, wrapped with soybean paper.
Lady Gaga|20.99|21.83|Shrimp tempura, eel, avocado, topped with spicy tuna, tobiko, crunchy, soybean paper.
Lobster Roll|20.99|21.83|Lobster salad, tobiko, cucumber, avocado, wrapped by soybean paper seaweed.
Magical Roll|18.99|19.75|Lobster mango salad, topped with spicy salmon, tempura flakes & Thai special mayo sauce.
Mango Dragon Roll|20.99|21.83|Eel & cucumber topped with avocado, mango, caviar & tobiko.
Napoleon Roll|21.99|22.87|Inside spicy tuna, soft shell crab, mango & avocado; topped with lobster salad & jalapeño.
Spicy Grill Roll (No Rice)|20.99|21.83|Crunchy spicy tuna & spicy yellowtail, salmon, avocado, crab meat, cucumber, wrapped in soybean paper.
Spicy Mama|20.99|21.83|Tuna, spicy tuna, spicy yellowtail, spicy salmon, crunch & asparagus.
Viking Roll|20.99|21.83|Eel, avocado, crunchy inside; tuna, salmon, yellowtail on top with spicy sauce.
Zen Roll|20.99|21.83|Spicy crunchy salmon, mango, topped with black pepper tuna, shrimp, eel, avocado & tobiko with mango sauce.
''',[rollnote])
section('dinner','Chef Special Rolls',4,'''
Big Mac|20.99|21.83|Spicy tuna, tobiko & avocado, spicy snow crab inside, topped with bonito flakes, tobiko, soybean wrap.
Bonzai Tree|21.99|22.87|Tuna, salmon, whitefish, avocado & tobiko rolled with cucumber.
Crazy Roll|18.99|19.75|Shrimp tempura, spicy tuna, tobiko, avocado, white seaweed.
Crazy Salmon Roll|21.99|22.87|Salmon, avocado inside, spicy salmon, crunch on top.
Coconut Shrimp Roll|21.99|22.87|Tempura coconut shrimp, avocado & lettuce inside with soybean wrap; shrimp, mayo, tobiko served with mango sauce.
Crunchy Roll|19.99|20.79|Shrimp tempura inside, mild spicy & crab meat on top.
Delta|18.99|19.75|Spicy crunch salmon inside, tuna & white tuna on top.
Fashion|19.99|20.79|Salmon, avocado inside; tuna, white tuna & salmon on top.
Fire Mountain|20.99|21.83|Spicy tuna with crunch inside, surrounded by crab stick & red tobiko on top.
Godzilla Roll|21.99|22.87|Tempura whole roll with shrimp tempura, cream cheese, avocado, topped with spicy mayo.
M16|21.99|22.87|Tempura whole roll with spicy salmon, spicy tuna, spicy yellowtail & cream cheese inside, spicy mayo & eel sauce on top.
New York Roll|20.99|21.83|Avocado, cream cheese, kani, lobster salad on top.
Out of Control Roll|21.99|22.87|Eel, cream cheese & kani inside; tuna, salmon & avocado outside.
Outstanding Roll|21.99|22.87|Tempura eel with spicy tuna; avocado outside, spicy mayo & eel sauce, soybean wrap.
Pink Lady|19.99|20.79|Spicy tuna, shrimp tempura, avocado.
Pyramid|19.99|20.79|Shrimp tempura, cucumber, spicy tuna with crunch, made triangle.
Red Phoenix|19.99|20.79|Eel, avocado inside, spicy salmon with red tobiko on top.
Scorpion|21.99|22.87|Soft shell crab, spicy tuna, cucumber with color tobiko on top.
Sweetheart Roll|20.99|21.83|Tuna outside, salmon & avocado with red & black tobiko inside, soybean paper.
Tiger Roll|20.99|21.83|Salmon, cucumber inside, seared salmon on top with spicy mayo.
Under Control|20.99|21.83|Spicy tuna & shrimp tempura inside, topped with tobiko & bonito flakes.
''',[rollnote])
section('dinner','Sushi Entree',5,'''
Edomae Style|34.99|36.39|7 pieces sushi & 1 tuna roll.
Chef’s Inspiration Sashimi|45.99|47.83|12 pieces of the chef’s selection.
Sushi & Sashimi Omakase|49.99|51.98|4 pieces sushi, 8 pieces sashimi & 1 spicy tuna roll.
Vegetarian Style Sushi|40.99|42.63|10 pieces sushi & 1 vegetable roll.
Zen Don|29.99|31.19|10 pieces assorted fish over a bed of sushi rice.
Salmon Don|23.99|24.95|Seasonal sushi rice with small pieces salmon sashimi, ikura, spicy salmon, salt kombu, small pieces avocado, bonito.
Tuna Lover|36.99|38.47|3 pieces sushi, 4 pieces sashimi, 1 spicy tuna roll.
Salmon Lover|34.99|36.39|3 pieces sushi, 4 pieces sashimi, 1 spicy salmon roll.
Super Super|42.99|44.71|Sushi or sashimi: 2 pieces tuna, 3 pieces salmon, 3 pieces yellowtail, 2 pieces eel & 1 spicy crunch tuna roll.
''',['With miso soup or salad or edamame. Any changes $3 (based on cash price) & up extra.'])
section('dinner','Sushi or Sashimi À La Carte',5,'''
White Tuna (1 pc)|4.99|5.19|
Fluke (1 pc)|4.99|5.19|
Smoked Salmon (1 pc)|4.99|5.19|
Salmon Roe (1 pc)|6.99|7.27|
Bluefin Tuna (1 pc)|5.99|6.23|
Scottish Salmon (1 pc)|4.99|5.19|
Yellow Tail (1 pc)|4.99|5.19|
Crab Stick (1 pc)|2.99|3.11|
Spanish Mackwrel (1 pc)|3.99|4.15|
Sweet Shrimp (1 pc)|6.99|7.27|
Tobiko (1 pc)|3.99|4.15|
Stripe Bass (1 pc)|3.99|4.15|
Octopus (1 pc)|4.99|5.19|
Smoked Eel (1 pc)|6.99|7.27|
Shrimp (1 pc)|3.99|4.15|
''')
section('dinner','Roll Combo',5,'''
Roll Combo A|22.99|23.91|Spicy tuna crunch roll, spicy salmon crunch roll, salmon avocado.
Roll Combo B|22.99|23.91|California roll, shrimp tempura, eel & avocado.
Roll Combo C|22.99|23.91|Yellowtail jalapeño roll, tuna avocado roll, spicy yellowtail crunch roll.
Roll Combo D|22.99|23.91|Salmon avocado roll, spicy tuna crunch roll, spicy white tuna crunch roll.
Roll Combo E|22.99|23.91|Spicy crunch kani, spicy white tuna crunch, salmon & avocado.
''',['With miso soup or salad or edamame. Any changes $3 (based on cash price) & up extra.'])
bento=['Served with miso soup or salad, California roll, fried shrimp shumai, rice.','Choose one entree. Brown rice $1 extra (based on cash price).',sub3]
section('dinner','Bento Box',6,'''
A. Teriyaki Chicken|19.99|20.79|
B. Teriyaki Salmon|25.99|27.03|
C. Sushi (7 pcs)|24.99|25.99|
D. Sashimi (7 pcs)|24.99|25.99|
E. Chicken Katsu|19.99|20.79|
F. Pork Katsu|19.99|20.79|
G. Shrimp Tempura|25.99|27.03|
H. Vegetable Tempura|18.99|19.75|
I. Shrimp Teriyaki|25.99|27.03|
''',bento)
section('dinner','Rice Dishes',6,'''
Japanese Curry|21.99|22.87|Choice of pork or chicken katsu over white rice.
Shrimp or Salmon Teriyaki|25.99|27.03|Grilled shrimp or salmon over white rice.
Chicken Teriyaki|18.99|19.75|Grilled chicken breast over white rice.
Unagi Don|24.99|25.99|7 pieces smoked eel over sushi rice with pickles & greens.
Gyu Don|19.99|20.79|Marinated sliced beef with bell peppers & onions over white rice.
Katsu|18.99|19.75|Choice of pork or chicken, deep fried with tonkatsu sauce.
''',['With salad or miso soup or edamame. Brown rice $1 extra (based on cash price).',sub3])
section('dinner','Dessert',6,'''
Green Tea Tempura Ice Cream|14.99|15.59|
Mochi Ice Cream|13.99|14.55|1 piece green tea, 1 mango, 1 black sesame, 1 red bean. $2 extra for any changes.
2 Scoops Ice Cream|9.99|10.39|Green tea.
''')
section('dinner','Ramen Noodles',7,'''
Tonkotsu Shoyu|20.99|21.83|Pork broth, roasted pork belly, green cabbage, kikurage, menma bamboo (lacto fermented bamboo shoots), spinach, arugula, scallion, black garlic oil.
Spicy Tonkotsu Shoyu|21.99|22.87|Pork broth, roasted pork belly, green cabbage, kikurage, menma bamboo, takana, spinach, arugula, scallion, black garlic oil, homemade spicy paste & shredded red hot pepper.
Tonkotsu|20.99|21.83|Pork broth, roasted pork belly, green cabbage, kikurage, sweet corn, scallions, menma bamboo, arugula, seasoned soft egg & black garlic oil.
Spicy Tonkotsu|21.99|22.87|Pork broth, roasted pork belly, green cabbage, kikurage, sweet corn, scallions, menma bamboo, arugula, seasoned soft egg, black garlic oil, homemade spicy paste & shredded red hot pepper.
Beef Ramen|20.99|21.83|Beef broth, roasted chashu beef, green cabbage, menma bamboo, sweet corn, scallion, arugula.
Spicy Beef Ramen|21.99|22.87|Beef broth, roasted chashu beef, green cabbage, menma bamboo, sweet corn, scallion, arugula, spicy bean sprouts, takana, homemade spicy paste & shredded red hot pepper.
Shoyu Ramen (No Meat)|18.99|19.75|Bonito broth, green cabbage, kikurage, menma bamboo, sweet corn, seasoned soft egg, nori, scallions.
Spicy Shoyu Ramen (No Meat)|19.99|20.79|Bonito broth, green cabbage, kikurage, menma bamboo, sweet corn, seasoned soft egg, nori, takana, scallions, homemade spicy paste & shredded red hot pepper.
Seafood Ramen|22.99|23.91|Pork broth, green cabbage, kikurage, menma bamboo, wakame, bean sprouts, shrimp, squid, scallops, scallions.
Spicy Seafood Ramen|23.99|24.95|Pork broth, green cabbage, kikurage, menma bamboo, wakame, spicy bean sprouts, shrimp, squid, scallops, takana, scallions, homemade spicy paste & shredded red hot pepper.
Karaage Udon Noodles|20.99|21.83|Bonito broth, fried boneless dark meat chicken, wakame, scallions & narutomaki.
Vegetables Ramen|20.99|21.83|Vegetable broth, green cabbage, bok choy, spinach, shiitake mushrooms, kikurage, asparagus, glazed tofu, scallions.
Spicy Vegetable Ramen|21.99|22.87|Vegetable broth, green cabbage, bok choy, spinach, shiitake mushrooms, kikurage, asparagus, glazed tofu, takana, scallions, homemade spicy paste & shredded red hot pepper.
Tomato Seafood Ramen|22.99|23.91|Tomato broth, green cabbage, kikurage, menma bamboo, wakame, bean sprouts, shrimp, squid, scallops, scallion.
Spicy Tomato Seafood Ramen|23.99|24.95|Tomato broth, green cabbage, kikurage, menma bamboo, wakame, spicy bean sprouts, shrimp, squid, scallops, takana, scallions, homemade spicy paste & shredded red hot pepper.
Curry Udon Noodle|20.99|21.83|Choice of deep fried chicken or pork.
Grill Chicken Yuzu Ramen|21.99|22.87|Vegetable broth, grilled chicken with green cabbage, bok choy, kikurage, seasoned soft egg.
Dan Dan Ramen in Soup Broth|20.99|21.83|Vegetable broth, grilled chicken with green cabbage, bok choy, kikurage, seasoned soft egg; contains soy milk.
Shrimp TomYum Rice Noodle Soup|19.99|20.79|Spicy lemongrass broth with shrimp, straw mushrooms, spicy bean sprouts, takana, cilantro & chili pepper. Spicy.
Seafood TomYum Rice Noodle Soup|23.99|24.95|Spicy lemongrass broth with shrimp, squid, scallops, straw mushrooms, takana, spicy bean sprouts, cilantro & chili pepper. Spicy.
Hawaii Breeze (Cold)|21.99|22.87|Tokyo wavy cold ramen noodle with shredded egg, crab meat, cucumbers, carrots, corn, avocado, seaweed salad, shrimp & shredded seaweed. House special sauce, sesame oil & sesame seeds.
Chicken Yaki Udon (Dry)|18.99|19.75|Sautéed udon with chicken, onion, bell pepper, scallion, broccoli.
''',[sub2,'Choose one noodle: thin ramen (Tokyo straight), thick ramen (Tokyo wavy), spinach ramen (Tokyo wavy, vegetable), udon, curly ramen (Tokyo curly), skinny rice noodle.'])
section('dinner','Ramen Topping',7,'''
Asparagus|2|2.08|
Avocado|3|3.12|
Arugula|2|2.08|
Bean Sprouts|2|2.08|
Bok Choy|2|2.08|
Glazed Tofu|2|2.08|
Green Cabbage|2|2.08|
Grill or Fried Chicken / Fried Pork|6|6.24|
Homemade Spicy Paste|3|3.12|
Kikurage|2|2.08|
Naruomaki (Fish Cake)|2|2.08|
Nori|2|2.08|
Steam Firm Tofu|2|2.08|
Shiitake Mushrooms|2|2.08|
Spicy Bean Sprouts|2|2.08|
Spinach|2|2.08|
Sweet Corn|2|2.08|
Steam Broccoli|2|2.08|
Tempura Shrimp (2 pcs)|7|7.28|
Wakame|2|2.08|
Extra Soup|5|5.20|
Extra Noodles|5|5.20|
Kakuni Slow Roasted Pork Belly (2 pcs)|5|5.20|
Roasted Chashu Beef (2 pcs)|5|5.20|
Steam Shrimp (4 pcs)|6|6.24|
Nitamago Seasoned Soft Boiled Egg|2|2.08|
Menma Seasoned Bamboo Shoots|2|2.08|
Takana (Pickled Mustard Leaf)|2|2.08|
''')

# Drinks are independently listed in all three supplied PDFs.
drink_specs=[('Sake','''
Hot Sake — Small|10||
Hot Sake — Large|17||
Sho Chiku Bai Nigori|16||Junmai · 375 ml. Fruity aromas and flavors of ripe banana, vanilla, melon, strawberry, and creamy sweet rice custard.
Umakara Migaki Hashiwari|16||Junmai · 300 ml. Stronger personality and boldness of umami that can be enjoyed at a variety of temperatures.
Itteki Nyuukon|16||Junmai Ginjo · 300 ml. Mild aromatics, full-to-medium body and slightly dry. Easy and enjoyable to drink.
Kubota|19||Junmai Daiginjo · 300 ml. Elegant nose with notes of pear and melon, harmonious acidity and pleasant mouthfeel.
Kiku Masamune Silver|16||Sparkling sake · 300 ml. Semi-dry with lush floral and fruity aromas, a refreshing character and crisp fruity finish.
Hana White Peach|19||Flavored sake · 375 ml. Aromas and flavors of just-ripe white peaches in cream with a sweet full-bodied palate.
Sho Chiku Bai Organic|16||Junmai · 300 ml. Rich and savory with comforting aromas and flavors of corn flakes, banana bread, nuts and mild spices.
Suigei “Drunken Whale”|16||Tokubetsu Junmai · 300 ml. A reserved aroma, gentle rice notes, perfect acidity and a clean finish combine to create a unique flavor.
Tengumai 50|19||Junmai Daiginjo · 300 ml. A reserved aroma, gentle rice notes, perfect acidity and a clean finish combine to create a unique flavor.
Born Junsui|16||Junmai Daiginjo · 300 ml. Refreshing Ginjo aroma with a rounded flavor and a clean finish that pairs well with Japanese dishes.
Nihonsakari “Sakari” Yuzu|19||Sake liqueur · 300 ml. Refined umami and moderate sweetness of Junmai-shu sake with flavors of Japanese Yuzu.
Hana Lychee|16||Flavored sake · 375 ml. Lychee aromatics and a sweet, full-bodied palate of lychee, yellow peach and lemon-lime.
'''),('Beer','''
Echigo IPA|8|8.32|Niigata, Japan.
Echigo Stout|9|9.36|Niigata, Japan.
Matcha IPA|14|14.56|Kyoto, Japan.
White Yuzu|14|14.56|Kyoto, Japan.
Orion|9|9.36|Okinawa, Japan.
Sapporo|9|9.36|
Kirin Ichiban|9|9.36|
Kirin Light|9|9.36|
Heineken|9|9.36|
Stella Artois|9|9.36|
Bud Light|6|6.24|
'''),('Wine','''
Chardonnay|9|9.36|White.
Pinot Grigio|9|9.36|White.
Cabernet|9|9.36|Red.
Pinot Noir|9|9.36|Red.
White Zinfandel|9|9.36|Rosé.
Plum Wine|9|9.36|Umeshu.
'''),('Cocktails','''
Cosmopolitan|10|10.40|
Rum Coke|10|10.40|
Mango Sunrise|10|10.40|
Long Island Ice Tea|10|10.40|
Tokyo Ice Tea|10|10.40|
Yuzu Matcha Aid|10|10.40|
Martini|10|10.40|Lychee / Mango / Pineapple.
Margarita|10|10.40|Lychee / Mango / Pineapple.
Mojito|10|10.40|Lychee / Mango / Pineapple.
Vodka Juice|10|10.40|Soda / Orange / Cranberry.
'''),('Chu-Hi','''
Yuzu|10|10.40|Japanese sparkling cocktail.
White Peach|10|10.40|Japanese sparkling cocktail.
Lychee|10|10.40|Japanese sparkling cocktail.
Kyoho Grape|10|10.40|Japanese grapes. Japanese sparkling cocktail.
Kabosu|10|10.40|Japanese citrus. Japanese sparkling cocktail.
'''),('Japanese Drinks','''
Calpico Soft Drink|6|6.24|White Peach / Lychee / Mango.
Creamy Soda|7|7.28|Melon / Mango.
Aloe|6|6.24|Exposed Original & Honey.
Unsweetened Tea|6|6.24|Green Tea / Jasmine.
Ramune|5|5.20|Original / Strawberry / Peach / Melon / Orange.
'''),('Soft Drinks','''
Soda / Tea|3.50|3.64|Coke / Diet Coke / Sprite / Ginger Ale / Club Soda / Ice Tea.
Poland Spring|3.50|3.64|
San Pellegrino|10|10.40|
''')]
for title,rows in drink_specs:
 s=section('dinner',title,8,rows)
 if title=='Sake':
  s['notes']=['Sake prices are listed as a single price in the supplied menu.']
  for item in s['items']: item['listedCents']=item.pop('cashCents')

section('lunch','Sushi Bar',2,'''
Sushi|16.99|17.67|5 pieces sushi & 1 California roll.
Sashimi|18.99|19.75|7 pieces sashimi & 1 bowl of sushi rice.
Sushi & Sashimi Combo|19.99|20.79|3 pieces sushi, 4 pieces sashimi & 1 California roll.
Tuna Lunch — Sushi|16.99|17.67|4 pieces sushi & 1 tuna roll.
Tuna Lunch — Sashimi|18.99|19.75|4 pieces sashimi & 1 tuna roll.
Salmon Lunch — Sushi|15.99|16.63|4 pieces sushi & 1 salmon roll.
Salmon Lunch — Sashimi|16.99|17.67|4 pieces sashimi & 1 salmon roll.
Yellow Tail Lunch — Sushi|16.99|17.67|4 pieces sushi & 1 yellowtail roll.
Yellow Tail Lunch — Sashimi|17.99|18.71|4 pieces sashimi & 1 yellowtail roll.
Eel Lunch — Sushi|16.99|17.67|4 pieces sushi & 1 eel roll.
Eel Lunch — Sashimi|18.99|19.75|4 pieces sashimi & 1 eel roll.
White Tuna Lunch — Sushi|15.99|16.63|4 pieces sushi & 1 white tuna roll.
White Tuna Lunch — Sashimi|16.99|17.67|4 pieces sashimi & 1 white tuna roll.
''',['Miso soup or salad or edamame.',sub3])
section('lunch','Rice Dishes',2,'''
Japanese Curry (Deep Fried)|16.99|17.67|Choice of pork or chicken katsu over white rice.
Shrimp or Salmon Teriyaki|18.99|19.75|Grilled shrimp or salmon over white rice.
Chicken Teriyaki|14.99|15.59|Grilled chicken breast over white rice.
Unagi Don|18.99|19.75|5 pieces smoked eel over sushi rice with pickles & greens.
Gyu Don|16.99|17.67|Marinated sliced beef with bell peppers & onions over white rice.
Katsu|15.99|16.63|Choice of pork or chicken, deep fried with tonkatsu sauce.
''',['With salad or miso soup or edamame. Brown rice $1 extra (based on cash price).',sub3])
section('lunch','Bento Box',2,'''
A. Teriyaki Chicken|13.99|14.55|
B. Teriyaki Salmon|14.99|15.63|
C. Sushi (5 pcs)|16.99|17.67|
D. Sashimi (5 pcs)|16.99|17.67|
E. Chicken Katsu|13.99|14.59|
F. Poke Katsu|13.99|14.59|
G. Shrimp Tempura|16.99|17.67|
H. Vegetable Tempura|13.99|14.59|
I. Shrimp Teriyaki|16.99|17.67|
''',bento)
section('lunch','Lunch Roll',2,'''
Lunch Roll — 2 Rolls|10.99|11.43|Choose two rolls from the selection below.
Lunch Roll — 3 Rolls|12.99|13.51|Choose three rolls from the selection below.
''',['Served with miso soup or salad.',sub3,'Hand roll or request for no rice: $1 extra (based on cash price) per roll.','Choose from: Avocado Asparagus Cucumber, Alaska, Avocado, Avocado & Cucumber, Boston, California, Cucumber, Eel Roll, Eel Avocado, Eel Cucumber, Mango & Avocado, Mix Vegetable, Philadelphia, Salmon, Salmon & Avocado, Salmon & Cucumber, Salmon Mango, Shrimp & Avocado, Shrimp & Cucumber, Shrimp Tempura, Spicy California Roll, Spicy Crunch Kani, Spicy Salmon (Crunch), Spicy Tuna (Crunch), Spicy White Tuna Roll (Crunch), Spicy Yellow Tail (Crunch), Sweet Potato (Tempura), Tempura Purple Yam, Tuna, Tuna & Avocado, Tuna & Cucumber, Tuna Mango, White Tuna & Avocado, White Tuna Cucumber, Yellow Tail Scallion, Yellowtail Jalapeno.'])
section('lunch','Extra Topping',2,'''
Brown Rice (each roll)|1|1.04|
Spicy Mayo|2|2.08|
Eel Sauce|2|2.08|
Teriyaki Sauce|2|2.08|
Ginger Dressing|2|2.08|
Cucumber|2|2.08|
Tobiko|3|3.12|
Cream Cheese|2|2.08|
Jalapeno|2|2.08|
Avocado|3|3.12|
Mango|3|3.12|
''')

section('happy-hour','Appetizers',1,'\n'.join(f'{n}|6.49|6.75|' for n in ['Cucumber Salad','Crispy Wings','Edamame','Fried Shrimp Shumai','Garden Green Salad','Gyoza (Pork)','Kani Salad','Karaage (with Sesame Seed)','Purple Sweet Potato Tempura','Seaweed Salad']))
section('happy-hour','Sushi Rolls',1,'\n'.join(f'{n}|6.49|6.75|' for n in ['Avocado Roll','Cucumber Roll','California','Eel Cucumber','Eel Roll','Mango & Avocado Roll','Mix Vegetable Roll','Spicy Tuna (Crunch)','Spicy Salmon (Crunch)','Spicy California Roll','Spicy Yellow Tail Roll (Crunch)','Spicy White Tuna Roll (Crunch)','Salmon Roll','Salmon Mango Roll','Salmon Cucumber Roll','Shrimp Cucumber Roll','Shrimp Tempura Roll','Sweet Potato Roll (with Eel Sauce on Top)','Tuna Roll','Tuna Mango Roll','Tuna & Cucumber Roll','Tempura Purple Yam Roll (with Eel Sauce on Top)','White Tuna & Mango Roll','Yellow Tail Scallion Roll','Yellow Tail Jalapeno Roll']),['Hand roll, brown rice or soy paper: $1 extra (based on cash price) per roll.',sub3])
section('happy-hour','Extra Topping',1,'''
Avocado|3|3.12|
Cream Cheese|2|2.08|
Cucumber|2|2.08|
Eel Sauce|2|2.08|
Ginger Dressing|2|2.08|
Jalapeno|2|2.08|
Mango|3|3.12|
Mango Sauce|3|3.12|
Spicy Mayo|2|2.08|
Teriyaki Sauce|2|2.08|
Tobiko|3|3.12|
''')
for menu in ['lunch','happy-hour']:
 for title,_ in drink_specs:
  src=next(s for s in menus['dinner']['sections'] if s['title']==title)
  s=copy.deepcopy(src)
  if menu=='happy-hour' and title not in ['Japanese Drinks','Soft Drinks']:
   s['notes']=s.get('notes',[])+['Items marked “Happy Hour selection” are printed in red in the supplied menu. Prices shown are exactly as listed.']
  for i,item in enumerate(s['items']):
   item['id']=f'{menu}-{s["id"]}-{i}'
   item['source']={'file':FILES[menu],'page':2 if menu=='happy-hour' and title in ['Japanese Drinks','Soft Drinks'] else 1}
   if menu=='happy-hour':
    selected=title in ['Cocktails','Chu-Hi'] or (title=='Beer' and item['name'] in ['Echigo Stout','Orion','Sapporo','Kirin Ichiban','Kirin Light','Heineken','Stella Artois']) or (title=='Wine' and item['name'] in ['Chardonnay','Pinot Grigio','Cabernet','Pinot Noir','White Zinfandel','Plum Wine'])
    if selected:item['markers']=['Happy Hour selection']
  menus[menu]['sections'].append(s)
menus['dinner']['availability']='Ramen, sushi & Japanese favorites'
menus['lunch']['availability']='Monday–Friday · 11:30 AM–4:00 PM · Except holidays'
menus['happy-hour']['availability']='4:00 PM–8:00 PM'
for key,menu in menus.items():
 menu['notice']='Please let us know if you have any food allergies, so we may accommodate you better. Consuming raw or undercooked meats, seafood, shellfish, poultry, or eggs may increase your risk of foodborne illness.'
 menu['photoNotice']='Photos are visual representations of food.'
(ROOT/'content/menus.json').write_text(json.dumps(list(menus.values()),ensure_ascii=False,indent=2),encoding='utf-8')
print({key:sum(len(s['items']) for s in menu['sections']) for key,menu in menus.items()})
