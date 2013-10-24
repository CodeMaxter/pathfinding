/* 
 * Clase que implementa un ArrayList
 * @class AStar
 * @author Alvaro José Agámez Licha
 */

var ArrayList = Class.extend({
    init: function() {
        this.items = []; //initialize with an empty array
    },
    add: function(objObject) {
       //Object are placed at the end of the array
       return this.items.push(objObject);
    },
    clear: function() {
        this.items = [];
    },
    count: function() {
        return this.items.length;
    },
    first: function() {
        return(this.items[0]);
    },
    /**
     * @param int intIndex Posición de donde queremos obtener un elemente
     */
    get: function(intIndex) {
        if(intIndex > -1 && intIndex < this.items.length) {
            return this.items[intIndex];
        } else {
            return undefined; //Out of bound array, return undefined
        }
    },
    indexOf: function(objObject, intStartIndex) {
        var intCount = this.items.length;
        var intReturnValue = -1;
        
        /**
         * Agregué esta validación para que el parámetro intStartIndex sea 
         * opcional - 2007/06/10
         */ 
        if ( intStartIndex == null ) {
            intStartIndex = 0;
        }

        if ( intStartIndex>-1 && intStartIndex<intCount ) {
            var intIndex = intStartIndex;

            while ( intIndex<intCount ) {
                if ( this.items[intIndex] == objObject ) {
                    intReturnValue = intIndex;
                    break;
                }

                intIndex++;
            }
        }

        return intReturnValue;
    },
    insert: function(objObject, intIndex) {
        var intCount = this.items.length;
        var intReturnValue = -1

        /**
         * Agregué esta validación para lograr que el parámetro intIndex sea 
         * opcional - 2009/07/17
         */ 
        if(intIndex == null) {
            intIndex = intCount;
        }

        if(intIndex > -1 && intIndex <= intCount) {
            switch(intIndex) {
                case 0: {
                    this.items.unshift(objObject);
                    intReturnValue = 0;
                    break;
                }
                case intCount:{
                    this.items.push(objObject);
                    intReturnValue = intCount;
                    break;
                }
                default: {
                    var arrHead = this.items.slice(0, intIndex);
                    var arrTail = this.items.slice(intIndex);

                    arrTail.unshift(objObject);
                    this.items = arrHead.concat(arrTail);
                    intReturnValue = intIndex;
                    break;
                }
            }
        }
        
        return intReturnValue;
    },
    last: function() {
        return(this.items[this.items.length - 1]);
    },
    lastIndexOf: function(objObject, intStartIndex)
    {
        var intCount = this.items.length;
        var intReturnValue = - 1;
        
        if ( intStartIndex > -1 && intStartIndex < intCount ) {
            var intIndex = intCount - 1;
                
            while ( intIndex >= intStartIndex ) {
                if ( this.items[intIndex] == objObject ) {
                    intReturnValue = intIndex;
                    break;
                }

                intIndex--;
            }
        }

        return intReturnValue;
    },
    /**
     * @param int intIndex Posición de donde queremos eliminar un elemente
     */
    remove: function(intIndex) {
        var intCount = this.items.length;

        if(intCount > 0 && intIndex > -1 && intIndex < this.items.length) {
            //var objItem = this.items[intIndex];

            var arrItem = this.items.splice(intIndex, 1);
            return(arrItem[0]);
        } else {
            return(null);
        }
    }
});
