// import us from './counties-albers-10m.json' with {type: "json"};
// import * as zll from './zipc_latlon.json' with {type: "json"};
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


let num_presses = 5;
update(4);
update(5);

function update(stage) {
    switch (stage) {
        case 1:
        case 2:
        case 3:
            // console.log("Hi!!");
            // console.log(d3.select("#b_t" + num_presses));
            d3.select("#b_t" + stage).transition()
                .duration(1000)
                // .attr("opacity", 0.0)
                .style("left", "125%")
                // .on("end", () => {
                //     d3.select(this).attr("visibility","hidden");}
                //     );
            d3.select("#b_t" + (stage + 1)).transition()
                .duration(1000)
                // .attr("opacity", 1.0)
                .style("left", "25%")
                // .on("start", () => {
                    // d3.select(this)
                    //     .style("visibility","visible")
                    //     // .style("transform","translateY(50px)");
                    // }
                // );
            break;
        
        case 4:
            // update(3);
            d3.select("#block").transition()
                .duration(1000)
                .style("opacity", 0.0)
                break;
        case 5:
            // update(4);
            // transition();
            d3.select("#treemap-container").transition()
                .duration(1000)
                .style("opacity", 0.0)
            break;

        case 6:
            // update(5);
            map.flyTo({
                center: [-110.9,32.2],
                zoom : 12
            })
            break;
        
        case 7:
            // update(6);
            map.flyTo({
                center: [-110.7875,32.052],
                zoom : 15
            })
            // map.
            //     map.addSource('tuscon', {
            //     'type':'geojson',
            //     'data': tuscon_shape
            // });
            const t = d3.timer((ti) => {
                map.setPaintProperty('tusconlayer', 'fill-opacity', Math.min(1,ti / 1000.0));
                console.log(ti);
                if (ti > 1000) t.stop();
            }, 100);
            // map.addLayer(
            // {
            //     'id':'tuscon',
            //     'type':'fill',
            //     'source':'tuscon',
            //     'layout':{},
            //     'paint': {
            //         'fill-color': '#088',
            //         'fill-opacity': 0.7,
            //         'fill-opacity-transition':{duration:2000}
            //     }
            // });
            // map.addLayer(
            // {
            //     'id':'tuscon',
            //     'type':'line',
            //     'source':'tuscon',
            //     'layout':{},
            //     'paint': {
            //         'line-color': '#000',
            //         'line-opacity': 1.0,
            //         'line-opacity-transition':{duration:2000}
            //     }
            // })
            break;

    }
}

document.addEventListener("keydown", (e) => {
    if (e.key == " ") {
        num_presses++;
    }
    update(num_presses);
});



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
    .attr("id", (d) => d.data.county)
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
    .style("fill", (d) => ["#ffe3c8", "#ffecd7"][Math.floor(Math.random() * 2)])
    .style("fill-opacity", 1.0)


function font_sizepx(d) {return ((d.value / 1e12) * 4 + 3);}

function font_size(d) {return font_sizepx(d) + "px"}

function font_sizepx2(d) {return (d.value / 1e12) * 4 + 3}

function font_size2(d) {return font_sizepx2(d) + "px"}


leaf.filter(d => d.value > 195000000).append("text")
    .attr("x", (d) => (d.x0 + d.x1) / 2.0 )
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

const projection1 = d3.geoMercator()
    // .center([-97.42011851400741, 38.56265081052521])
    .center([-96.7, 38.5])
    .translate([total_width / 2, total_height / 2])
    .scale(1770)


function d_to_radius(d) {
    const val = Math.max(5,d.value / 10000000);
    return 5;
}

function transition() {

    const duration = 1000;
    // const duration = 1000;

    d3.select("#treemap-container").transition().duration(duration).style("background-color",null);
        
    leaf.selectAll("rect").transition().duration(duration)
            .attr("height", d_to_radius)
            .attr("width", d_to_radius)
            .attr("x", d => -d_to_radius(d)/2.0)
            .attr("y", d => -d_to_radius(d)/2.0)
            .attr("rx", d_to_radius)
            .attr("ry", d_to_radius)
        
    leaf.selectAll("text").remove();

    leaf.transition().duration(duration)
        .attr("transform", d => `translate(${projection1([d.data.lon, d.data.lat])})`)      
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