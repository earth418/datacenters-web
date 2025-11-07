// import us from './counties-albers-10m.json' with {type: "json"};
// import * as zll from './zipc_latlon.json' with {type: "json"};
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {geoAitoff} from "https://cdn.skypack.dev/d3-geo-projection@4";

const projection = geoAitoff();

let num_presses = 0;

if (num_presses > 3) {
    d3.select("#block").style("opacity", 0.0);
    d3.select("#treemap-container").style("opacity", 0.0);
    update(num_presses);
}
// update(4, true);
// update(5, true);

function animate_map_property(layer, property, func_of_time, duration, delay=300) {
    const t = d3.timer((ti) => {
        map.setPaintProperty(layer, property, func_of_time(Math.min(1,ti / duration)));
        if (ti > duration) t.stop();
    }, delay);
}

const duration = 1500;

let stop_rotating = false;


function transition_top(element, duration) {
    const top_gap = "5%";
    // return d3.select(element).transition("t_"+element).duration(duration).style("top",top_gap);
    return d3.select(element).transition("t_"+element).duration(duration).style("margin-top",top_gap);
}

function spinGlobe() {
    const center = map.getCenter();
    center.lng += 10.0;
    map.easeTo({center, duration: 1000, easing: (n) => n});
}

let keep_spinning = true;

map.on("moveend", () => {if (keep_spinning) spinGlobe();});


function update(stage, instant = false) {

    console.log(stage);
    const duration = instant ? 0 : 1500;

    switch (stage) {
        case 1:
        case 2:
        case 3:
            d3.select("#start").transition().duration(duration).style("opacity",0.0);

            d3.select("#b_t" + stage).transition("bt" + stage)
                .duration(duration)
                .style("left", "125%")
                
            d3.select("#b_t" + (stage + 1)).transition("bt" + (stage + 1))
                .duration(duration)
                .style("left", "25%")
            break;
        
        case 4:
            // update(3);
            d3.select("#block").transition()
                .duration(duration)
                .style("opacity", 0.0)
                .on("end", () => {
                    d3.select(this).style("display","none");
                    console.log("done!")
                }
                );
                break;
        case 5:
            // update(4);
            transition();
            d3.select("#treemap-container").transition()
                .duration(duration*2.5)
                .style("opacity", 0.0)
                .on("end", () => {
                    d3.select(this).style("display","none");}
                    );

            d3.timeout(spinGlobe, 2.5*duration);
            break;
            // requestAnimationFrame(rotateCamera);

        case 6:
            keep_spinning = false;
            map.stop();
            
            d3.select("#sidebar1").transition()
                .duration(duration)
                .style("opacity",1.0);
            
            transition_top("#s1p1", duration);
            // d3.select('#s1p1').transition().duration(duration).style("top",top_gap);

            map.flyTo({
                center: [-110.99,32.21],
                zoom : 11
            })
            break;
        
        case 7:
            map.flyTo({
                center: [-110.7875,32.052],
                zoom : 15
            })

            d3.select("#s1p1").transition().duration(duration).style("color","#707070ff");
            transition_top("#s1p2", duration);
            // d3.select('#s1p2').transition().duration(duration).style("top",top_gap);
            // d3.select('#p3').transition().duration(duration).style("top","25%");

            animate_map_property('tusconlayer', 'fill-opacity', (t) => 0.8 * t, duration);                
            break;

        case 8:
            // update(6);
            map.flyTo({
                center: [-110.8875,32.152],
                zoom : 10.5
            })

            // d3.select('#p2').transition().duration(duration).style("top","25%");
            d3.select("#s1p2").transition().duration(duration).style("color","#707070ff");
            transition_top('#s1p3', duration);
            // d3.select('#s1p3').transition().duration(duration).style("top","10%");

            animate_map_property("tusconcitylayer", "fill-opacity", (t) => 0.5 * t, duration);
            break;
        
        case 9:
            d3.select("#s1p3").transition().duration(duration).style("color","#707070ff");
            transition_top("#s1p4", duration);
            // d3.select('#s1p4').transition().duration(duration).style("top","10%");
            break;

        case 10:
            d3.select("#sidebar1").transition().duration(duration).style("opacity",0.0);
            animate_map_property("tusconcitylayer", "fill-opacity", (t) => 0.5 * (1.0 - t), duration);
            
            map.flyTo({
                center: [-110.8875,32.152],
                zoom : 5
            })
            break;
        
        case 11:
            
            d3.select("#sidebar2").transition().duration(duration).style("opacity",1.0);
            map.flyTo({
                    center: [-90.04,35.14],
                    zoom : 8
                })
                transition_top("#s2p1", duration);
                animate_map_property("xAIcolossuslayer", "fill-extrusion-opacity", (t) => 0.8*t, duration);
                // d3.select('#s2p1').transition().duration(duration).style("top","10%");
            break;

        case 12:
            map.flyTo({
                    center: [-90.15627488376435,35.05966538381292],
                    zoom : 12
                });

                d3.select("#s2p1").transition().duration(duration).style("color","#707070ff");
                transition_top("#s2p2", duration);
                
                d3.timeout(() => map.addLayer({
                    'id':'boxtownText',
                    'type':'symbol',
                    'source':'boxtown',
                    'layout':{
                        'text-field':'Boxtown'
                    }
                }), duration / 2.0);
                // animate_map_property("boxtownlayer", "fill-opacity", (t) => 0.8*t, duration);
                // d3.select('#s2p2').transition().duration(duration).style("top","5%");
            break;

        case 13:
            
            map.flyTo({
                center: [-90.15627488376435,35.05966538381292],
                zoom : 15,
                pitch: 45.0,
                bearing: 0.0,
                duration: duration,
            });

            d3.timeout(() => requestAnimationFrame(rotateCamera), duration);
            
            // new Promise(r => setTimeout(r, duration)).then(rotateCamera(0.0));

            d3.select("#s2p2").transition().duration(duration).style("color","#707070ff");
            transition_top("#s2p3", duration);
            animate_map_property("xAIcolossuslayer", "fill-extrusion-height", (t) => 50.0*t, duration);
            // d3.select('#s2p3').transition().duration(duration).style("top","5%");
            break;
            
        case 14:
            stop_rotating = true;
            
            d3.timeout(() => {
                map.flyTo({
                    center: [-90.15627488376435,35.05966538381292],
                    zoom : 12,
                    pitch: 15.0,
                    bearing: 0.0,
                    duration: duration,
                });

                // d3.timeout(() => requestAnimationFrame(rotateCamera), duration);
                
                d3.select("#s2p3").transition().duration(duration).style("color","#707070ff");
                transition_top("#s2p4", duration);

                d3.select("#windmap").transition().duration(duration).style("opacity", 1.0);
                
                animate_map_property("boxtownlayer", "fill-opacity", (t) => 0.5 * t, duration); 
            }, 50);
            break;

        case 15:

            d3.select("#sidebar2").transition().duration(duration).style("opacity",0.0);
            animate_map_property("boxtownlayer", "fill-opacity", (t) => 0.5 * (1.0 - t), duration); 
           
            map.flyTo({
                center: [-90.15627488376435,35.05966538381292],
                zoom : 8,
                pitch: 0.0,
                bearing: 0.0,
                duration: duration,
            });

            d3.select("#windmap").transition().duration(duration).style("opacity", 0.0);
            
            break;
        
        case 16:
            d3.select("#sidebar3").transition().duration(duration).style("opacity",1.0);
            transition_top("#s3p1", duration);

            map.flyTo({
                center: [-90.18594924055635,35.146547415054584],
                zoom : 12,
                pitch: 0.0,
                bearing: 0.0,
                duration: duration,
            });
            break;
            
        case 17:
            d3.select("#s3p1").transition().duration(duration).style("color","#707070ff");
            transition_top("#s3p2", duration);
            
            map.flyTo({
                center: [-90.216323,35.108877],
                zoom : 15,
                duration: duration,
            });
            animate_map_property("westmemphisgoogle_layer", "fill-opacity", (t) => 0.8 * t, duration);

            break;
        
        case 18:
            d3.select("#s3p2").transition().duration(duration).style("color","#707070ff");
            transition_top("#s3p3", duration);
            
            map.flyTo({
                center: [-90.216323,35.108877],
                zoom : 13,
                duration: duration,
            });

            break;

        case 19:
            map.flyTo({
                center: [-90.216323,35.108877],
                zoom : 11,
                duration: duration,
            });
            d3.select("#s3p3").transition().duration(duration).style("color","#707070ff");
            transition_top("#s3p4", duration);

            break;
        
        case 20:
            d3.select("#sidebar3").transition().duration(duration).style("opacity",0.0);
            break;

        case 21:
            d3.select("#sidebar4").transition().duration(duration).style("opacity",1.0);
            transition_top("#s4p1", duration);
            
            map.flyTo({
                center: [-86.50958727110606, 41.69935263597052],
                zoom : 12,
                duration: duration,
            });

            break;
        case 22:
            d3.select("#s4p1").transition().duration(duration).style("color","#707070ff");
            transition_top("#s4p2", duration);
            map.flyTo({
                center: [-86.50958727110606, 41.69935263597052],
                zoom : 10,
                duration: duration,
            });

            
            break;
        case 23:
            d3.select("#s4p2").transition().duration(duration).style("color","#707070ff");
            transition_top("#s4p3", duration);
            map.flyTo({
                center: [-86.50958727110606, 39.69935263597052],
                zoom : 6,
                duration: duration*2.0,
            });

            for (let i = 0; i < 50; ++i) {
                let h = indiana_cities[i].features[0].properties.houses;
                let radius = Math.sqrt(h) / 30.0;
                animate_map_property(`indiana_${i}`, "circle-radius", (t) => t * radius, duration / 2.0, duration / 2.0 + i * 25);
            }
            animate_map_property(`indiana_layer`, "fill-opacity", (t) => 0.25 * t, duration, duration);

            break;
        case 24:
            d3.select("#s4p3").transition().duration(duration).style("color","#707070ff");
            transition_top("#s4p4", duration);
            break;
        case 25:
            d3.select("#sidebar4").transition().duration(duration).style("opacity",0.0);
            break;
        // case 26:
        //     d3.select("#sidebar5").transition().duration(duration).style("opacity",1.0);
        //     transition_top("#s5p1", duration);
        //     break;
        // case 27:
        //     d3.select("#s5p1").transition().duration(duration).style("color","#707070ff");
        //     transition_top("#s5p2", duration);
        //     break;
        // case 28:
        //     d3.select("#s5p2").transition().duration(duration).style("color","#707070ff");
        //     transition_top("#s5p3", duration);
        //     break;
        // case 29:
        //     d3.select("#s5p3").transition().duration(duration).style("color","#707070ff");
        //     transition_top("#s5p4", duration);
        //     break;
    }
}

let zero;
function rotateCamera(time) {
    zero = time;
    animateRotateCamera(zero);
}
function animateRotateCamera(time) {

    map.setBearing(((time - zero) / 100) % 360, {duration: 0});
    if (stop_rotating)
        stop_rotating = false;
    else
        requestAnimationFrame(animateRotateCamera);
}



document.addEventListener("keydown", (e) => {
    if (e.key == " ") {
        num_presses++;
        update(num_presses);
    } else if (e.key == 37) {
        // left
        // num_presses--;   
    } else if (e.key == 39) {
        // right
        // num_presses++;
    }
});

document.addEventListener("touchstart", (e) => {
    update(++num_presses);
})


function parseCSV(str) {
    // Function written by Trevor Dixon, https://stackoverflow.com/a/14991797

    const arr = [];
    let quote = false;  // 'true' means we're inside a quoted field

    // Iterate over each character, keep track of current row and column (of the returned array)
    for (let row = 0, col = 0, c = 0; c < str.length; c++) {
        let cc = str[c], nc = str[c+1];        // Current character, next character
        arr[row] = arr[row] || [];             // Create a new row if necessary
        arr[row][col] = arr[row][col] || '';   // Create a new column (start with empty string) if necessary

        // If the current character is a quotation mark, and we're inside a
        // quoted field, and the next character is also a quotation mark,
        // add a quotation mark to the current column and skip the next character
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }

        // If it's just one quotation mark, begin/end quoted field
        if (cc == '"') { quote = !quote; continue; }

        // If it's a comma and we're not in a quoted field, move on to the next column
        if (cc == ',' && !quote) { ++col; continue; }

        // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
        // and move on to the next row and move to column 0 of that new row
        if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }

        // If it's a newline (LF or CR) and we're not in a quoted field,
        // move on to the next row and move to column 0 of that new row
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
        if (cc == '\r' && !quote) { ++row; col = 0; continue; }

        // Otherwise, append the current character to the current column
        arr[row][col] += cc;
    }
    return arr;
}

// const ai = await d3.csv("../data/largest_ai_companies.csv"));

const array_data = parseCSV(ai_companies);
array_data[0] = ["origin","origin","","","","","","",""] // this is the name layer anyway

let data = array_data.map((w) => {
    return {name : w[1], symbol: w[2], value: w[3], parent: "origin" };
        // , country : w[5], address: w[3], county: w[5], city: w[4], state: w[6], zip: w[7], lat: w[8], lon: w[9], parent: "origin"};
});




// thank you to 
// https://d3-graph-gallery.com/graph/treemap_basic.html
// for helping me realize I needed this parent stuff
// data[0].name = "origin";
data[0].parent = "";

function color_from_name(name) {
    if (name == "Amazon")
        return "#cb6200";
    if (name == "Alphabet (Google)")
        return "#47cc22";
    if (name == "Microsoft")
        return "#25cbcbff";
    if (name == "Meta Platforms (Facebook)")
        return "#0d0df6ff";

    return "#f5ce8c";
}

let total_width = window.innerWidth,
total_height = window.innerHeight;

let treemap_ht = total_width - 230;
let treemap_wd = total_height - 106;

const root_data = d3.stratify()
    .id((d) => d.name)
    .parentId((d) => d.parent)
    (data);

root_data.sum((d) => +d.value);

const root = d3.treemap()
.tile(d3.treemapSquarify)
.size([treemap_ht, treemap_wd])
.padding(0)
.paddingTop(230)
.paddingLeft(106)
(root_data);


// Create the SVG container.
const svg = d3.create("svg")
    .attr("viewBox", [0, 0, total_width, total_height])
    .attr("width", total_width)
    .attr("height", total_height)
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

const leaf = svg.selectAll("g")
    .data(root.leaves())
    .attr("id", (d) => d.data.name)
    .join("a")
        .attr("x", (d) => d.x0+10)
        .attr("y", (d) => d.y0+20)
        .attr("href", (d) => `#`)

function format(num) {
    if (num >= 1e12) {
        return (num / 1e12).toFixed(2) + "T";
    } else if (num >= 1e9) {
        return (num / 1e9).toFixed(0) + "B";
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(0) + "M";
    }
}

leaf.append("title")
    .text(d => `${d.data.name.slice(1).replace(/\//g, ".")}\n${format(d.value)}`)

leaf.append("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .style("stroke","black")
    .style("stroke-width",0.5)
    .style("fill", d => color_from_name(d.data.name))
    .style("fill-opacity", 1.0)
    // .style("fill", (d) => ["#ffe3c8", "#ffecd7"][Math.floor(Math.random() * 2)])


function font_sizepx(d) {return ((d.value / 1e12) * 4 + 3);}

function font_size(d) {return font_sizepx(d) + "px"}

function font_sizepx2(d) {return (d.value / 1e12) * 4 + 3}

function font_size2(d) {return font_sizepx2(d) + "px"}


leaf.filter(d => d.value > 195000000).append("text")
    .attr("x", (d) => (d.x0 + d.x1) / 2.0)
    .attr("y", (d) => (d.y1 + d.y0) / 2.0)
    // .attr("dy", "0.5em")
    .attr("text-anchor", "middle")
    .attr("font-size", font_size)
    .attr("fill", "black")
    .attr("font-family", "sans-serif")
    .text(d => d.data.name)
    .append("tspan")
        .text(d => `$${format(d.value)}`)
        .attr("x", (d) => d.x1)
        .attr("y", (d) => d.y1)
        .attr("dy", (d) => "-0.5em")
        .attr("dx", (d) => "-0.25em")
        .attr("text-anchor", "end")
        .attr("font-size", font_size2)
        .attr("fill", "black")
        .attr("weight", "bold")

document.getElementById("treemap-container").append(svg.node());

const proj = d3.geoMercator()
    // .center([-97.42011851400741, 38.56265081052521])
    // .center([-96.7, 38.5])
    .center([-96.0066, 38.7135])
    .translate([total_width / 2, total_height / 2])
    .scale(2500)

const projglobe = d3.geoOrthographic()
    .translate([total_width / 2, total_height / 2])
    .rotate([-96.0066, 38.7135])
    // .scale()
    // .rotate([0, -25])


function d_to_radius(d) {
    const val = Math.max(5,d.value / 10000000);
    return 5;
}

function transition() {

    const duration = 1000;
    // const duration = 1000;

    d3.select("#treemap-container").transition().duration(duration).style("background-color",null);
        
    leaf.selectAll("rect").transition("a").duration(duration)
        .style("opacity",0.0)
    //         .attr("height", d_to_radius)
    //         .attr("width", d_to_radius)
    //         .attr("x", d => -d_to_radius(d)/2.0)
    //         .attr("y", d => -d_to_radius(d)/2.0)
    //         .attr("rx", d_to_radius)
    //         .attr("ry", d_to_radius)
        
    leaf.selectAll("text").remove();


    let a_d_located = [];
    for (let i = 0; i < amazon_datacenters.features.length; ++i) {
        let cc = amazon_datacenters.features[i].geometry.coordinates;
        if (cc[1] == -1 && cc[0] == -1) {}
        else a_d_located.push(cc);
    }

    const num = 9;
    const og_leaf = leaf.filter(d => d.data.name == "Amazon");
    for (let i = 0; i < num * (16/9); ++i) {
        for (let j = 0; j < num; ++j) {
            // const p = amazon_datacenters.features[i * num + j].geometry.coordinates;
            const p = a_d_located[i*num + j];
            console.log("proj: " + projglobe(p) + ", coords: " + p);
            const clone_leaf = og_leaf.clone();
            clone_leaf.transition().duration(1.0*duration)
                    .attr("transform", `translate(${projglobe(p[0], p[1])})`)
            
            clone_leaf.append("rect")
                .attr("x", d => d.x0 + (d.x1 - d.x0) * i / num)
                .attr("y", d => d.y0 + (d.y1 - d.y0) * j / num)
                .attr("width", d => (d.x1 - d.x0) / num)
                .attr("height", d => (d.y1 - d.y0) / num)
                .style("stroke","black")
                .style("stroke-width",0.5)
                .style("fill", d => color_from_name(d.data.name))
                .style("fill-opacity", 1.0)
                .transition().duration(1.0*duration)
                    .attr("height", d_to_radius)
                    .attr("width", d_to_radius)
                    .attr("x", d => -d_to_radius(d)/2.0)
                    .attr("y", d => -d_to_radius(d)/2.0)
                    .attr("rx", d_to_radius)
                    .attr("ry", d_to_radius)
        }
    }

    // leaf.transition().duration(duration)
    //     .attr("transform", d => `translate(${proj([d.data.lon, d.data.lat])})`)      
}


// const top_svg = d3.create("svg")
//     .attr("viewBox", [0, 0, total_width, total_height])
//     .attr("width", total_width * 0.75)
//     .attr("height", total_height * 0.75)
//     .attr("style", "max-width: 100%; height: auto; font: 10px; font-family: Source Sans 3;");

// document.getElementById("top-container").append(top_svg.node());


// document.addEventListener("keydown", (e) => {
//     if (e.key == "d") {
//         transition();
//     }
//     if (e.key == "f") {
//         untransition();
//         f_index++;
//         if (f_index == findex_map.length) {
//             f_index = 0;
//         }
//     }
// });

window.isMobile = function(){
  if(window.matchMedia("(any-hover:none)").matches) {
    return true;
  } else {
    return false;
  }
};

d3.select("#start").transition().duration(duration).style("opacity",1.0);

if (window.isMobile())
    document.getElementById("start").innerText = "(Tap screen to continue)";
