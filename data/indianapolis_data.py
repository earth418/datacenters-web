raw_text = """
Rank	City	Value
1	Indianapolis, IN	399,634
2	Fort Wayne, IN	117,692
3	Evansville, IN	58,785
4	South Bend, IN	47,558
5	Carmel, IN	40,477
6	Fishers, IN	38,084
7	Gary, IN	37,963
8	Bloomington, IN	37,537
9	Lafayette, IN	33,911
10	Hammond, IN	32,548
11	Muncie, IN	30,622
12	Kokomo, IN	29,872
13	Noblesville, IN	28,170
14	Anderson, IN	27,465
15	Greenwood, IN	27,251
16	Terre Haute, IN	26,613
17	Elkhart, IN	25,263
18	Mishawaka, IN	24,715
19	Jeffersonville, IN	23,027
20	Columbus, IN	22,809
21	Lawrence, IN	20,612
22	Westfield, IN	20,038
23	New Albany, IN	18,429
24	Richmond, IN	17,287
25	West Lafayette, IN	16,309
26	Merrillville, IN	16,255
27	Portage, IN	15,837
28	Valparaiso, IN	15,238
29	Michigan City, IN	15,061
30	Goshen, IN	13,718
31	Plainfield, IN	13,271
32	Marion, IN	12,906
33	Hobart, IN	12,818
34	Crown Point, IN	12,452
35	East Chicago, IN	12,429
36	Schererville, IN	12,398
37	Zionsville, IN	11,927
38	Brownsburg, IN	11,181
39	Granger, IN	10,795
40	Highland, IN	10,791
41	Greenfield, IN	10,402
42	Clarksville, IN	10,058
43	La Porte, IN	9,946
44	Franklin, IN	9,924
45	Munster, IN	9,786
46	Shelbyville, IN	9,128
47	Avon, IN	8,851
48	Seymour, IN	8,733
49	New Castle, IN	8,560
50	Vincennes, IN	8,401
51	St. John, IN	7,614"""
# 52	Warsaw, IN	7,538
# 53	Lebanon, IN	7,517
# 54	Logansport, IN	7,502
# 55	Huntington, IN	7,477
# 56	Griffith, IN	7,318
# 57	Crawfordsville, IN	7,152
# 58	Jasper, IN	7,087
# 59	Beech Grove, IN	6,983
# 60	Bedford, IN	6,831
# 61	New Haven, IN	6,684
# 62	Dyer, IN	6,591
# 63	Frankfort, IN	6,519
# 64	Speedway, IN	6,441
# 65	Connersville, IN	6,291
# 66	Chesterton, IN	6,025
# 67	Cedar Lake, IN	5,993
# 68	Auburn, IN	5,822
# 69	Madison, IN	5,661
# 70	Washington, IN	5,409
# 71	Martinsville, IN	5,334
# 72	Greensburg, IN	5,314
# 73	Peru, IN	5,239
# 74	Lake Station, IN	5,120
# 75	Wabash, IN	5,006
# 76	Yorktown, IN	4,942
# 77	Bluffton, IN	4,791
# 78	Decatur, IN	4,708
# 79	Columbia City, IN	4,679
# 80	Plymouth, IN	4,620
# 81	Kendallville, IN	4,556
# 82	Sellersburg, IN	4,546
# 83	Danville, IN	4,364
# 84	Whitestown, IN	4,286
# 85	Lowell, IN	4,229
# 86	Mooresville, IN	4,118
# 87	Elwood, IN	4,028
# 88	Princeton, IN	3,947
# 89	Greencastle, IN	3,805
# 90	Brazil, IN	3,798
# 91	McCordsville, IN	3,787
# 92	Tell City, IN	3,776
# 93	Bargersville, IN	3,706
# 94	Huntertown, IN	3,691
# 95	Angola, IN	3,614
# 96	Scottsburg, IN	3,475
# 97	Rochester, IN	3,371
# 98	Charlestown, IN	3,322
# 99	Mount Vernon, IN	3,180
# 100	Hartford City, IN	3,117"""

from requests import request
import json

def search_location(query):
    
    url = "https://photon.komoot.io/api/?q=" + query
    req = request("GET",url)
    # print(req.json())
    return req.json()



cities_houses = []
for l in raw_text.split("\n")[2:]:
    lt = l.split("\t")
    cities_houses.append([lt[1], int(lt[2].replace(",",""))])
    
print(cities_houses)

hh = 0

new_point = lambda lat, lon, h : {
    "type": "FeatureCollection",
    "features":
    [{
    "type":"Feature",
    "properties": {
        "houses": h
    },
    "geometry": {
        "type":"Point",
        "coordinates": [lat, lon]
        }
    }]
}

point_list = []

with open("indiana_cities.geojson", "w") as icg:

    for [city, houses] in cities_houses:
        
        loc = search_location(city)
        point = [-1, -1]
        if loc is not None and 'features' in loc and len(loc['features']) > 0:
            point = loc['features'][0]['geometry']['coordinates']

        print(point)
        point_list.append(new_point(point[0], point[1], houses))
        # hh += houses
        
    json.dump(point_list, icg)
    # print(hh)