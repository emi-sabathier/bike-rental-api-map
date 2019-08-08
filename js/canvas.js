    /**
     * @param {string} idCanvas     canvas ID inside HTML
     * @param {number} width        canvas width
     * @param {number} height       canvas height
     */
    class Canvas {
        constructor(idCanvas, width, height) {
            this.canvas = $(idCanvas);
            this.ctx = this.canvas[0].getContext("2d");
            this.draw = false;
            this.isEmpty = true;
            this.canvas[0].width = width;
            this.canvas[0].height = height;

            // Draw style
            this.ctx.lineWidth = 2;
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
            this.events();
            $("#clear_btn").on("click", this.clear.bind(this));          
            
        }
        /**
         * Events of mouse and touch + clean canvas
         */ 
        events() {
            this.canvas.on("mousedown touchstart", (e) => {                
                this.ctx.beginPath();
                this.draw = true;
                e.preventDefault();
            });
            this.canvas.on("mousemove touchmove", this.sign.bind(this));
            this.canvas.on("mouseup touchend", () => {
                this.draw = false;
            });
        }

        /**
         * Method sign
         * @param {object} e event used in the method => Getting positions of mouse or finger
         */
        sign(e) {
            if (!this.draw) return;
            if (this.draw === true) {
                this.posX;
                this.posY;
                if (e.type === "mousemove") {
                    this.posX = e.pageX - this.canvas.offset().left;
                    this.posY = e.pageY - this.canvas.offset().top;
                } else if (e.type === "touchmove") {
                    this.posX = e.touches[0].pageX - this.canvas.offset().left;
                    this.posY = e.touches[0].pageY - this.canvas.offset().top;
                }
                this.isEmpty = false;
                this.ctx.lineTo(this.posX, this.posY);
                this.ctx.stroke();
            }
        }
        clear() {
            this.ctx.clearRect(0, 0, this.canvas[0].width, this.canvas[0].height);
            this.isEmpty = true;
        }
    }
