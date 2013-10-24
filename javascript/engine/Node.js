/* 
 * Clase que implementa un Nodo en un camino encontrado con la técnica de 
 * búsqueda de caminos AStar
 * 
 * @class Node
 * @author Alvaro José Agámez Licha
 */

var Node = Class.extend({
    init: function() {
        this.f = 0;  // g+h (for calculating next/best node)
        this.h = 0;  // distance from node to destination
        this.g = 0;  // cost of travel (distance from source to node)
        this.nodeNumber = 0;  // tile number (y*mapwidth+x effectively)
        this.parent = null;  // parent  
    }
});
