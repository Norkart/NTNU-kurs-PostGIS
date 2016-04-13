var globalCartoDB_SQL_Layer = null;

$("#btn_runquery").click(function() {
    var query = $("#sqlcommand").text();
    var cartocss = $("#cartocss").text();
    runSQL_API(query);
    updatemap(query, cartocss);
})

function createMap() {
    window.map = new L.Map('mapresult', {
        center: [63.5, 10.5],
        zoom: 4
    });

    window.cartodb_basemap = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    }).addTo(map);

    window.norkart_basemap = L.tileLayer.webatlas({
        apikey: 'apikey',
        mapType: L.TileLayer.Webatlas.Type.GREY
    });

    cartodb.createLayer(map, 'https://alexanno-test.cartodb.com/api/v2/viz/07773f86-ff57-11e5-bc60-0ecfd53eb7d3/viz.json')
        .addTo(map)
        .on('done', function(layer) {
            window.cdblayer = layer;
            globalCartoDB_SQL_Layer = layer.createSubLayer({
                sql: 'null',
                cartocss: '#layer {}'
            });
        })
        .on('error', function(err) {
            alert("some error occurred: " + err);
        });
    //add click => run sql-query on dwithin
}
createMap();

function updatemap(sql, cartocss) {
    globalCartoDB_SQL_Layer.setCartoCSS(cartocss);
    globalCartoDB_SQL_Layer.setSQL(sql);
}

function runSQL_API(sql) {
    console.log("run sql ", sql);
    $.getJSON('https://alexanno-test.cartodb.com/api/v2/sql/?format=geojson&q=' + sql, function(data) {
        console.log("data returnert fra sql api:", data);

        $("#dataresult").text(JSON.stringify(data, null, 2).substr(0, 15000));
        Prism.highlightAll();
    });
}
