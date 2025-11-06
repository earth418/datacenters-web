# format
'''
<a class="ui card card1" href="/australia/melbourne/amazon-aws-54-80-ferris-rd/">
    <div class="content">
        <div style="font-size: 15px;" class="header">
        Amazon AWS - 54-80 Ferris Rd
        </div>
        <div class="description">
            54-80 Ferris Rd
            <br>Cobblebank <br>Australia
        </div>
    </div>
    <div class="extra content darkgrey">
        <img alt="Australia" class="ui rounded image" src="https://static.datacentermap.com/img/flags/w20/au.png">
                        &nbsp;Melbourne
        <div style="float: right;" class="ui red small label">
            Land Banked
        </div>
    </div>
</a>
'''

# XAI because it's only two
xai = '<a class="ui card card1" href="/usa/tennessee/memphis/5400-tulane-road/"><div class="content"><div style="font-size: 15px;" class="header">5400 Tulane Road</div><div class="description">5400 Tulane Rd<br>Whitehaven<br>Tennessee, USA</div></div><div class="extra content darkgrey"><img alt="Tennessee, USA" class="ui rounded image" src="https://static.datacentermap.com/img/flags/w20/us.png">&nbsp;Memphis, TN<div style="float: right;" class="ui red small label">Planned</div></div></a><a class="ui card card1" href="/usa/tennessee/memphis/xai-memphis-supercluster/"><div class="content"><div style="font-size: 15px;" class="header">xAI Memphis Supercluster</div><div class="description">3231 Riverport Rd<br>Memphis<br>Tennessee, USA</div></div><div class="extra content darkgrey"><img alt="Tennessee, USA" class="ui rounded image" src="https://static.datacentermap.com/img/flags/w20/us.png">&nbsp;Memphis, TN</div></a>'


from time import sleep
import requests
import csv
import json


def search_location(query):
    
    url = "https://photon.komoot.io/api/?q=" + query
    req = requests.request("GET",url)
    # print(req.json())
    return req.json()

# datacenters = []

# datacenters.append([
#     "company",
#     "address",
#     "longitude",
#     "latitude",
#     "status",
#     "link_to_page",
#     "note"])

new_point = lambda lat, lon : {
    "type":"Feature",
    "properties": {},
    "geometry": {
        "type":"Point",
        "coordinates": [lat, lon]
        }
    }

gj = {"type": "FeatureCollection",
  "features": []}

def convert_csv_to_geojson(in_csv, out_geojson):
    with open(in_csv,'r') as awsc:
        
        r = csv.reader(awsc)
        header = next(r)
        
        for l in r:
            if abs(float(l[2])) > 1.0 and abs(float(l[3])) > 1.0:
                gj["features"].append(new_point(l[2], l[3]))
            
    with open(out_geojson, 'w', newline='') as aws_gj:
        json.dump(gj, aws_gj)
    


def convert_scrape_to_data(filename_in, filename_out, company_name, text_in=None):
    
    c = text_in
    if c is None:
        with open(filename_in) as tx:
            c = tx.read()
    if c is None: # again??
        return
    
    # print(c)
    with open(filename_out, 'w+', newline='') as awsc:
        csw = csv.writer(awsc)
        csw.writerow([
            "company",
            "address",
            "longitude",
            "latitude",
            "status",
            "link_to_page",
            "note"])

        # ind = 0
        for loc in c.split("<a"):
            # ind += 1
            # if ind < 84:
            #     continue
            
            status = "Active"
            if "Land Banked" in loc:
                status = "Land Banked"
            if "Under Construction" in loc:
                status = "Under Construction"
            if "Planned" in loc:
                status = "Planned"
                
            i1 = loc.find('href=\"')
            i2 = loc[i1+6:].find('\"')
            # print(i1, i2)
            url = "https://www.datacentermap.com" + loc[i1+6:i1+6+i2]
            
            q_i1 = "<div class=\"description\">"
            i1 = loc.find(q_i1)
            i2 = loc[i1:].find("</div>")
            # print(f'i1: {i1}, i2: {i2}, txt={loc}')
            address_full = loc[i1+len(q_i1):i1+i2].replace("<br>"," ")
            
            add_i = address_full.split("<i>")
            # [address, note]
            address = add_i[0]
            note = add_i[1] if len(add_i) == 2 else ""
            note = note.removesuffix("</i>")
            
            # print(address)
            loc = search_location(address)
            
            point = [-1, -1]
            
            if loc is not None and 'features' in loc and len(loc['features']) > 0:
                point = loc['features'][0]['geometry']['coordinates']
            
            # datacenters.append({
            #     "company":"Amazon",
            #     "address":address,
            #     "longitude":point["coordinates"][0],
            #     "latitude":point["coordinates"][1],
            #     "status":status,
            #     "link_to_page":url,
            #     "note":note
            # })
            
            # long = point["coordinates"][0]
            # lati = point["coordinates"][1]
            
            # datacenters.append([
            csw.writerow([
                company_name,
                address,
                point[0],
                point[1],
                status,
                url,
                note]
            )

            sleep(0.02)
                

# convert_scrape_to_data("", "xai_centers.csv", "xai", xai)

# convert_csv_to_geojson("xai_centers.csv", "xai_centers.geojson")


# convert_scrape_to_data("microsoft_datacentermap_raw.txt", "MS_centers.csv", "Microsoft")

# convert_csv_to_geojson("MS_centers.csv", "MS_centers.geojson")

if True:
    mcsv = "meta_centers.csv"
    # convert_scrape_to_data("metacenters.txt", mcsv, "Meta")
    
    convert_csv_to_geojson(mcsv,"meta_centers.geojson")