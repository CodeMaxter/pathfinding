/* 
 * Clase que permite construir un mapa
 * @class MapBuilder
 * @author Alvaro José Agámez Licha
 */

var MapBuilder = Class.extend({
    init: function(objMap){
        this.gameMap = objMap;
    },
    getMap: function() {
        return this.gameMap;
    },
    hideGrid: function() {
        $('.gridElement').hide();
    },
    showGrid: function() {
        if ($('.gridElement').length > 0) {
            $('.gridElement').show();
            return;
        }

        var intTileHeight = this.gameMap.config.tileHeight;
        var intTileWidth = this.gameMap.config.tileWidth;
        var intColums = (this.gameMap.config.width / intTileWidth);
        var intRows = (this.gameMap.config.height / intTileHeight);
        var intGridColumnHeight = this.gameMap.config.height + 'px';
        var intGridRowWidth = this.gameMap.config.width + 'px';

        for (var intColumn = 1; intColumn < intColums; intColumn++) {
            $('<div/>').css({
                'height': intGridColumnHeight,
                'left': intColumn * intTileWidth + 'px'
            }).addClass('gridElement').addClass('gridColumn')
              .appendTo(this.gameMap.reference);
        }

        for (var intRow = 1; intRow < intRows; intRow++) {
            $('<div/>').css({
                'width': intGridRowWidth,
                'top': intRow * intTileHeight + 'px'
            }).addClass('gridElement')
              .addClass('gridRow').appendTo(this.gameMap.reference);
        }
    },
    createMap: function(strMapContainer) {
        var self = this;

        this.gameMap = new Map();
        this.gameMap.load('resources/gamemap/basicmap.json');
        this.gameMap.onLoad = function() {
            this.render(strMapContainer);
            self.showGrid();
        }
    },
    destroyMap: function() {
        this.gameMap.destroy();
    }
 });