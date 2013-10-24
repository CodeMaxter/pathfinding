/**
 * @author Alvaro José Agámez Licha
 */

$(document).ready(function() {
    var objMapBuilder = new MapBuilder();

    $('#cmdCreateMap').click(function() {
        objMapBuilder.createMap('#mapContainer');
    });
    
    $('#cmdDestroyMap').click(function() {
        objMapBuilder.destroyMap();
    });

    $('#cmdShowGrid').click(function() {
        objMapBuilder.showGrid();
    });
    
    $('#cmdHideGrid').click(function() {
        objMapBuilder.hideGrid();
    });

    $('#cmdCreatePlayer').click(function() {
        var objMap = objMapBuilder.getMap();

        objPlayer = new Player('Kyridanccelo', objMap);
        //objMap.player = objPlayer;
        objMap.addPlayer(objPlayer);

        objPlayer.loadConfig('resources/players/kyridanccelo/config.json');
        objPlayer.show('down');
    });
});