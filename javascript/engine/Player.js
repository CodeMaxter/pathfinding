/* 
 * Clase que representa un jugador
 * @class Player
 * @author Alvaro José Agámez Licha
 */

var Player = Class.extend({
    init: function(strName, objMap) {
        if (objMap === null) {
            alert('ERROR: No player map defined');
        }

        /**
         * @var Estable si un personaje está activo o no
         */
        this.active = false;

        this.actualAnimation = '';

        this.animations = {};

        /**
         * Capa que representa el personaje
         * @var DOM
         */
        this.container = null;

        this.interval = 380;

        /**
         * Objeto que representa el mapa en el que se encuentra el personaje en un momento dado
         * @var Map
         */
        this.map = objMap;

        this.name = strName;

        /**
         * Imágenes que representan las diferentes posiciones del personaje en posición estática
         * @var array
         */
        this.playerPositions = {};

        this.pathFinder = new AStar();
        this.pathFinder.height = this.map.config.height;
        this.pathFinder.width = this.map.config.width;
        this.pathFinder.tileHeight = this.map.config.tileHeight;
        this.pathFinder.tileWidth = this.map.config.tileWidth;  

        this.tilePosition = 0;

        /**
         * La cantidad de pixeles que se moverá el personaje al caminar
         * @var int
         */
        this.walkVariation = 16;

        var objSelf = this;
        this.container = $('<div/>', {
            'id': strName,
            'class': 'player',
            'click': function() {
                objSelf.active = true;
                alert('activo');
            }
        });

        $(this.map.reference).append(this.container);
        
        this.pathIndex = 0;
    },
    followPath: function() {
        var objNode, intDistance;

        objNode = this.pathFinder.openList.get(this.pathIndex);

        if ( objNode != null ) {
            objNode = $("#Tile" + objNode.nodeNumber);    

            if ( this.getTop() > objNode.position().top ) {
                intDistance = (this.getPosition() - parseInt(objNode.attr('id').substr(4))) / (this.map.config.width / this.map.config.tileWidth);

                this.walk('up', intDistance);
                return(false);
            }

            if ( this.getTop() < objNode.position().top ) {
                intDistance = (this.getPosition() - parseInt(objNode.attr('id').substr(4))) / (this.map.config.width / this.map.config.tileWidth);

                this.walk('down', intDistance);
                return(false);
            }

            if ( this.getLeft() > objNode.position().left ) {
                intDistance = this.getPosition() - parseInt(objNode.attr('id').substr(4));

                this.walk("left", intDistance);
                return(false);
            }

            if ( this.getLeft() < objNode.position().left ) {
                intDistance = this.getPosition() - parseInt(objNode.attr('id').substr(4));

                this.walk("right", intDistance);
                return(false);
            }
        } else {
            this.container.css({
                'background-image': 'url(' + this.playerPositions[this.actualAnimation] + ')'
            });
        }
    },
    findPath: function(intSource, intDestination) {
        this.pathIndex = 0;
        this.pathFinder.findPath(intSource, intDestination);
        this.followPath();
    },
    getLeft: function() {
        return this.container.position().left;
    },
    getPosition: function(objTile) {
        var intRowTiles, intColumn, intRow;

        // Si no se especifica ningún objeto se busca la posición del personaje
        if(objTile == null) {
            objTile = this.container;
        }

        // Cantidad de Tiles que hay en cada fila del mapa
        intRowTiles = this.map.config.width / this.map.config.tileWidth;

        var intTop = objTile.position().top;

        // Se hace esta verificación para corregir el top real del personaje
        if ( objTile.height() >  this.map.config.tileHeight) {
            intTop += parseInt(this.map.config.tileHeight);
        }
        
        //intRow = Math.ceil(intTop / this.map.config.tileHeight) + 1;
        intRow = Math.ceil(intTop / this.map.config.tileHeight);
        intColumn = Math.ceil(objTile.position().left / this.map.config.tileWidth) + 1;

        //return Math.abs(intRowTiles * (intRow - 1) + intColumn);
        return Math.abs(intRowTiles * (intRow) + intColumn);
    },
    getTop: function() {
        var intTop = this.container.position().top;
        if (this.container.height() > this.map.config.tileHeight) {
            intTop += this.map.config.tileHeight;
        }
        return intTop;
    },
    loadConfig: function(strConfigFile) {
        var objSelf = this;

        $.ajax({
            async: false,
            url: strConfigFile,
            type: 'get',
            dataType: 'json',
            success: function(objConfig) {
                objSelf.name = objConfig.name;
                objSelf.tilePosition = objConfig.tilePosition;

                /**
                * Se leen y almacenan las imágenes que representan las diferentes posiciones del personaje en
                * posición estática
                */
                $(objConfig.positions).each(function(intIndex, objPosition) {
                    objSelf.playerPositions[objPosition.name] = objPosition.src;
                });

                $(objConfig.animations).each(function(intIndex, objAnimation) {
                    /**
                     * Se crea un objeto Animation que se encargará del movimiento 
                     * del personaje en una dirección dada
                     */
                    var objPlayerAnimation = new Animation(objAnimation.name);

                    // Se establece el contenedor de la animación
                    objPlayerAnimation.container = objSelf.container;

                    // Intervalo de las animaciones para caminar
                    objPlayerAnimation.interval = 280;
                    objPlayerAnimation.addImages(objAnimation.images);
                    objSelf.animations[objPlayerAnimation.name] = objPlayerAnimation;

                    /*$(objAnimation.images).each(function(intIndex, objImage) {
                        // Se definen las imágenes para el objeto Animation
                        objPlayerAnimation.addImage(objImage.src);
                        objSelf.animations[objPlayerAnimation.name] = objPlayerAnimation;
                    });*/
                });
            },
            error: function(objJson, strTextStatus, objErrorThrown) {
                alert(strTextStatus + ' ' + objErrorThrown);
            }
        });
    },
    show: function(strPosition) {
        var objMapTile = $("#Tile" + this.tilePosition);
        var intLeftCorrection, intTopCorrection;

        // Si verifica si se ha definido un mapa para el personaje
        if ( this.map == null ) {
            alert("Map Error: No Map Specified for the Player.");
            return(false);
        }

        //$(this.container).css({'background-image': 'url(' + this.playerPositions[strPosition] + ')'});

        /**
        * Estos cálculos se usan para que el personaje aparezca centrado en el Tile del mapa que le corresponde
        * @date 2007/05/13
        */
        if ( objMapTile.width() > $(this.container).width() ) {
            intLeftCorrection = ( objMapTile.width() - $(this.container).width() ) / 2;
        } else {
            intLeftCorrection = 0;
        }

        if ( objMapTile.height() > $(this.container).height() ) {
            intTopCorrection = ( objMapTile.height() - $(this.container).height() ) / 2;
        } else {
            if ( objMapTile.height() < $(this.container).height() ) {
                intTopCorrection = objMapTile.height() - $(this.container).height();
            } else {
                intTopCorrection = 0;
            }
        }

        this.container.css({
            'background-image': 'url(' + this.playerPositions[strPosition] + ')',
            'left': objMapTile.position().left + intLeftCorrection + 'px',
            'top': objMapTile.position().top + intTopCorrection + 'px'
        });
        //this.container.css({'top': objMapTile.position().top + intTopCorrection + 'px'});
        this.container.show();
    },
    stop: function() {
        if ( this.ActualAnimation != "" ) {
            this.Animations[this.ActualAnimation].Stop();
        }
    },
    walk: function(strDirection, intDistance) {
        /**
        * Dependiendo de la dirección del movimiento el cálculo de la distancia 
        * que debe caminar el personaje resulta negativo, por esta razón toma el 
        * valor absoluto de la distancia, para que siempre el valor sea positivo.
        * @date 2007/05/12
        */
        intDistance = Math.abs(intDistance);

        // 2011-06-19 - No entiendo para qué hize esto, lo desactivé
        //this.animations[strDirection].onComplete = this.onComplete;
        this.animations[strDirection].onComplete = this.onComplete;
        this.animations[strDirection].onComplete = $.proxy( this.onComplete, this );
        this.actualAnimation = strDirection;
        this.animations[strDirection].stop();

        switch ( strDirection ) {
            case "up": {
                this.animations[strDirection].topVariation = -1 * this.walkVariation;
                break;
            }

            case "down": {
                this.animations[strDirection].topVariation = this.walkVariation;
                break;
            }

            case "left": {
                this.animations[strDirection].leftVariation = -1 * this.walkVariation;
                break;
            }

            case "right": {
                this.animations[strDirection].leftVariation = this.walkVariation;
                break;
            }    
        }

        this.state = 'walking';  
        this.animations[strDirection].execute(intDistance);
    },
    onComplete: function() {
        if ( this.pathFinder.closeList.count() > 0 ) {
            this.pathIndex += 1;
            this.followPath();
        }
    }
});