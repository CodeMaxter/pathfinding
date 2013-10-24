/* 
 * Clase que representa una Animación
 * @class Player
 * @author Alvaro José Agámez Licha
 */

var Animation = Class.extend({
    init: function(strName) {
        this.container = null;
        this.images = [];
        this.imageIndex = 0;
        this.interval = 350;  // 500 milisegundos
        this.leftVariation = 0;  // Movimiento en el eje X
        this.loop = false;  // Determina si se debe calcular o no el número de repeticiones
        this.name = strName;  
        this.repeat = 0;
        this.repeatVariation = 1;  // Variación que se realiza en la repeticiones de la animación
        this.state = 'Stop';
        this.timerNumber = 0;
        this.topVariation = 0;  // Movimiento en el eje Y
    },
    addImage: function(strImage) {
        this.images[this.images.length] = strImage;
    },
    addImages: function(arrImages) {
        this.images = arrImages;
    },
    execute: function(intRepeat) {
        // Es necesario hacer esta asignación para que funcione el llamado a la función Execute en el setTimeOut
        var objSelf = this;

        this.state = "Running";
        if ( this.timerNumber == -1 ) {
            return(false);
        }

        // Si no se ha calculado el número de repeticiones
        if ( !this.loop ) {
            // Si debe repetir indefinitamente, esto es cuando no se pasa el parámetro intRepeat al método Execute
            if ( intRepeat == null ) {
                this.repeatVariation = 0;      
            } else {
                this.repeat = (intRepeat * this.images.length) - 1;
            }
            this.loop = true;
        }

        // Si no se han cumplido todas las repeticiones
        if ( this.repeat >= 0 ) {
            if ( this.imageIndex >= this.images.length ) {
                this.imageIndex = 0;
            }

            // Hace avanzar la animación
            $(this.container).css({'background-image': 'url(' + this.images[this.imageIndex].src + ')'});

            $(this.container).css({'left': $(this.container).position().left + this.leftVariation + 'px'});
            $(this.container).css({'top': $(this.container).position().top + this.topVariation + 'px'});
            this.imageIndex += 1;
            this.repeat -= this.repeatVariation;

            window.clearTimeout(this.timerNumber);
            this.timerNumber = window.setTimeout(function() { objSelf.execute() }, this.interval);
        } else {
            // Terminó la animación y si hay una función que maneje este método, se invoca    
            if ( typeof(this.onComplete) == "function" ) {
                this.onComplete();
            }
        }
    },
    stop: function() {
        window.clearTimeout(this.timerNumber);
        this.imageIndex = 0;
        this.loop = false;
        this.repeat = 0;
        this.state = 'Stop';
        //delete(this.TimerNumber);
    }
});