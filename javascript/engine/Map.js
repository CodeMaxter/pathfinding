/* 
 * Clase que representa un mapa
 * @class Map
 * @author Alvaro José Agámez Licha
 */

var Map = Class.extend({
    init: function(intIndex, strContainer) {
        this.config = null;
        this.reference = null;
        this.players = [];
    },
    addPlayer: function(objPlayer) {
        this.players.push(objPlayer);
    },
    destroy: function() {
        this.reference.empty();
        this.reference.remove();
    },
    load: function(strMapFile) {
        var objSelf = this;

        $.ajax({
            url: strMapFile,
            type: 'get',
            dataType: 'json',
            data: null,
            success: function(objJson) {
                objSelf.config = objJson;
                if(typeof(objSelf.onLoad) == 'function') {
                    objSelf.onLoad();
                }
            },
            error: function(objJson, strTextStatus, objErrorThrown) {
                alert(strTextStatus + ' ' + objErrorThrown);
            }
        });
    },
    notify: function(strMethod) {
        for ( var intIndex = 0; intIndex < this.players.length; intIndex++ ) {
            var objPlayer = this.players[intIndex];

            switch (strMethod) {
                case 'findPath': {
                    objPlayer[strMethod](objPlayer.getPosition(), parseInt( arguments[1] ) );
                    break;
                }
            }
        }
    },
    render: function(strContainer) {
        var objSelf = this;

        if(this.reference == null) {
            this.reference = $('<div/>', {
                'id': 'gameMap',
                'class': 'gameMap'
            });
            this.reference.css({'height': this.config.height + 'px'});
            this.reference.css({'width': this.config.width + 'px'});
            $(strContainer).append(this.reference);
        }

        var intColums = (this.config.width / this.config.tileWidth);
        var intRows = (this.config.height / this.config.tileHeight);

        var intTiles = intColums * intRows;
        // Se crean los tiles del mapa con el tipo default
        for(var intTileIndex = 1; intTileIndex <= intTiles; intTileIndex++) {
            var objNewTile = $('<div/>', {
                'id': 'Tile' + intTileIndex,
                'class': 'defaultTile'
            }).data('info', {'type': ''});

            objNewTile.appendTo(this.reference);
        }

        intTiles = this.config.tiles.length;
        // Se crean los tiles personalizados del mapa
        for(var intTileIndex = 0; intTileIndex < intTiles; intTileIndex++) {
            $('#Tile' + this.config.tiles[intTileIndex].position).css({
                'background-image': 'url(' + this.config.tiles[intTileIndex].image + ')'
            })
                .css({'z-index': objSelf.config.tiles[intTileIndex].zindex})
                .data('info', {
                    'postion': objSelf.config.tiles[intTileIndex].position,
                    'type': objSelf.config.tiles[intTileIndex].type
                });
        }

        $('div.defaultTile').click(function(objEvent) {
            var objInfo = $(this).data('info');
            //alert(objSelf.player.getPosition());

            // Si se selecciona un tile con un objeto sólido se cancela la acción
            if ( objInfo != null && objInfo.type == 'solid' ) {
                alert("Solido");
                return false;
            }

            objSelf.notify( 'findPath', this.id.substr(4) );
            /*this.pathFinding.height = objSelf.height;
            this.pathFinding.width = objSelf.width;
            this.pathFinding.tileHeight = objSelf.tileHeight;
            this.pathFinding.tileWidth = objSelf.tileWidth;  
            this.player.pathIndex = 0;
            this.pathFinding.findPath(objSelf.player.getPosition(), parseInt(this.id.substr(4)));
            this.player.followPath();*/
        });
    }
});