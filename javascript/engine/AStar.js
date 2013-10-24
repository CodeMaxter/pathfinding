/* 
 * Clase que implementa la técnica de búsqueda de caminos AStar
 * @class AStar
 * @author Alvaro José Agámez Licha
 */

var AStar = Class.extend({
    init: function() {
        // Propiedades Privadas
        this.allowDiagonalMovement = false;
        this.columns = 0;
        this.height = 0;
        this.isPath = false;  // if true then we have a path from src to dst
        this.rows = 0;
        this.tileHeight = 0;
        this.tileWidth = 0;
        this.width = 0;
        this.actualNode = null;
        this.closeList = new ArrayList();
        this.destination = 0;
        this.openList = new ArrayList();
        this.source = 0;
    },
    addOpenList: function(objNode) {
        var intIndex;

        // Se valida que cada nodo no sea de tipo sólido
        if ( $("#Tile" + objNode.nodeNumber).data('info').type != 'solid' ) {
            intIndex = this.inOpenList( objNode );
            // Se valida que cada nodo no esté en la lista abierta
            if ( intIndex == false ) {            
                // Se valida que cada nodo no esté en la lista cerrada
                if ( this.inCloseList( objNode ) == false ) {
                    this.openList.add( objNode );
                    //this.AdjacentsList.Add(objNode);
                }
            }
            else
            {
                this.openList.items[intIndex] = objNode;
            }
        }
    },
    calculateValue: function() {
        var objNode;
        for ( var intIndex=0; intIndex < this.openList.count(); intIndex++ ) {
            objNode = this.openList.get( intIndex );
            objNode.h = this.getDistance( objNode.nodeNumber, this.destination ) * 10;
            objNode.f = objNode.g + objNode.h;
            this.openList.items[intIndex] = objNode;
        }
    },
    findBestNode: function() {
        var intBestValue = 0, intBestNode = 0;

        this.calculateValue();
        /**
         * Tomamos por defecto el valor del primer nodo de la lista abierta como 
         * el menor, luego iteramos a partir del segundo nodo de la lista
         */
        intBestValue = this.openList.get(0).f;
        for ( var intIndex=1; intIndex < this.openList.count(); intIndex++ ) {
            if ( intBestValue > this.openList.get( intIndex ).f ) {
                intBestValue = this.openList.get( intIndex ).f;
                intBestNode = intIndex;
            }
        }

        return this.openList.get( intBestNode );
    },
    findPath: function(intSource, intDestination) {
        var objNode;

        this.openList.clear();
        this.closeList.clear();

        this.source = intSource;
        this.destination = intDestination;

        this.columns = this.width / this.tileWidth;
        this.rows = this.height / this.tileHeight;

        // Se crea el nodo de la posición inicial
        objNode = new Node();
        objNode.parent = null;
        objNode.nodeNumber = intSource;

        this.actualNode = objNode;

        // Se agrega el nodo inicial a la lista abierta
        this.addOpenList(objNode);

        while ( this.actualNode.nodeNumber != intDestination && this.openList.count() > 0 ) {
            // Remover el cuadro seleccionado de la lista abierta
            this.openList.remove( this.openList.indexOf( this.actualNode ) );

            // Pasar el cuadro seleccionado a la lista cerrada
            this.closeList.add(this.actualNode);

            // Se buscan los nodos adyacentes al nodo inicial
            //this.AdjacentsList.Clear();
            this.getAdjacents(this.actualNode.nodeNumber);

            this.actualNode = this.findBestNode();    
        }

        // Si se encontró el camino
        if ( this.actualNode.nodeNumber == intDestination ) {
            this.closeList.add(this.actualNode);
            this.openList.clear();

            objNode = this.closeList.last();
            while ( objNode.nodeNumber != intSource ) {
                this.openList.insert( objNode, 0 );
                objNode = objNode.parent;
            }
        }
    },
    /**
     * Obtiene los cuadros adyacentes al cuadro pasado como parámetro y calcula
     * el valor de g, h y f
     * @param intPosition cuadro al que se le ayaran los cuadros adyacentes
     */
    getAdjacents: function( intPosition ) {
        var objNode;

        //if((intPosition - this.RowTiles) >= 0)
        if ( this.getRow(intPosition) > 1 ) {
            objNode = new Node();
            objNode.parent = this.actualNode;
            //objNode.NodeNumber = (intPosition - this.RowTiles);  //Arriba
            objNode.nodeNumber = ( intPosition - this.columns );  //Arriba
            objNode.g = 10;
            //objNode.h = this.GetDistance(objNode.NodeNumber, this.Destination) * 10;
            //objNode.f = objNode.g + objNode.h;
            this.addOpenList( objNode );
        }

        //if((intPosition + this.RowTiles) < (this.Columns * this.Rows))
        if ( this.getRow( intPosition ) < this.rows ) {
            objNode = new Node();
            objNode.parent = this.actualNode;
            //objNode.NodeNumber = (intPosition + this.RowTiles);  //Abajo
            objNode.nodeNumber = ( intPosition + this.columns );  //Abajo
            objNode.g = 10;
            //objNode.h = this.GetDistance(objNode.NodeNumber, this.Destination) * 10;
            //objNode.f = objNode.g + objNode.h;
            this.addOpenList( objNode );
        }

        if ( this.getColumn( intPosition ) < this.columns ) {
            objNode = new Node();
            objNode.parent = this.actualNode;
            objNode.nodeNumber = ( intPosition + 1 );  // Derecha
            objNode.g = 10;
            //objNode.h = this.GetDistance(objNode.NodeNumber, this.Destination) * 10;
            //objNode.f = objNode.g + objNode.h;
            this.addOpenList( objNode );
        }

        if ( this.getColumn( intPosition ) > 1 ) {
            objNode = new Node();
            objNode.parent = this.actualNode;
            objNode.nodeNumber = ( intPosition - 1 );  // Izquierda
            objNode.g = 10;
            //objNode.h = this.GetDistance(objNode.NodeNumber, this.Destination) * 10;
            //objNode.f = objNode.g + objNode.h;    
            this.addOpenList( objNode );
        }

        // Por ahora no se consideran las diagonales
        if ( this.allowDiagonalMovement == true ) {
            objNode = new Node();
            objNode.parent = this.actualNode;
            //objNode.NodeNumber = ((intPosition - this.RowTiles) - 1);  // Diagonal Arriba Izquierda
            objNode.nodeNumber = ( ( intPosition - this.columns ) - 1 );  // Diagonal Arriba Izquierda
            objNode.g = 14;
            //objNode.h = this.GetDistance(objNode.NodeNumber, this.Destination) * 10;
            //objNode.f = objNode.g + objNode.h;    
            this.addOpenList( objNode );

            objNode = new Node();
            objNode.parent = this.actualNode;
            //objNode.NodeNumber = ((intPosition + this.RowTiles) - 1);  // Diagonal Abajo Izquierda
            objNode.nodeNumber = ( ( intPosition + this.columns ) - 1 );  // Diagonal Abajo Izquierda
            objNode.g = 14;
            //objNode.h = this.GetDistance(objNode.NodeNumber, this.Destination) * 10;
            //objNode.f = objNode.g + objNode.h;
            this.addOpenList( objNode );

            objNode = new Node();
            objNode.parent = this.actualNode;
            //objNode.NodeNumber = ((intPosition - this.RowTiles) + 1);  // Diagonal Arriba Derecha
            objNode.nodeNumber = ( ( intPosition - this.columns ) + 1 );  // Diagonal Arriba Derecha
            objNode.g = 14;
            //objNode.h = this.GetDistance(objNode.NodeNumber, this.Destination) * 10;
            //objNode.f = objNode.g + objNode.h;
            this.addOpenList( objNode );

            objNode = new Node();
            objNode.parent = this.actualNode;
            //objNode.NodeNumber = ((intPosition + this.RowTiles) + 1);  // Diagonal Abajo Derecha
            objNode.nodeNumber = ( ( intPosition + this.columns ) + 1 );  // Diagonal Abajo Derecha
            objNode.g = 14;
            //objNode.h = this.GetDistance(objNode.NodeNumber, this.Destination) * 10;
            //objNode.f = objNode.g + objNode.h;
            this.addOpenList(objNode);
        }
    },
    getColumn: function( intTileNumber ) {
        var intValue, intColumnTiles;

        intColumnTiles = Math.floor( intTileNumber / this.columns );    
        intValue = intTileNumber - ( intColumnTiles * this.columns );

        // Si el Tile está en la última columna del mapa
        if ( intValue == 0 ) {
            intValue = intTileNumber / intColumnTiles;
        }

        return intValue;
    },
    /**
     * Calcula la distancia Manhattan
     * @param intSource posición de inicio
     * @param intDestination posición de destino
     */
    getDistance: function( intSource, intDestination ) {
        var intDistance/*, intLeftSource, intTopSource, intLeftSource, intLeftDestination*/;

        // Se calcula la distancia horizontal
        intDistance = Math.abs( this.getColumn( intSource ) - this.getColumn( intDestination ) );
        // Se le adiciona la distancia vertical
        intDistance += Math.abs( this.getRow( intSource ) - this.getRow( intDestination ) ); 
        return intDistance;
    },
    getRow: function( intTileNumber ) {
        return Math.ceil( intTileNumber / this.columns );
    },
    inCloseList: function( objNode ) {
        for ( var intIndex=0; intIndex < this.closeList.count(); intIndex++ ) {
            if ( this.closeList.get( intIndex ).nodeNumber == objNode.nodeNumber ) {
                return intIndex;
            }
        }
        return false;
    },
    inOpenList: function( objNode ) {
        for ( var intIndex=0; intIndex < this.openList.count(); intIndex++ ) {
            if ( this.openList.get( intIndex ).nodeNumber == objNode.nodeNumber ) {
                return intIndex;
            }
        }
        return false;
    }
});