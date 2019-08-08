class Slider {
    /**
     * [[Description]]
     * @param {string} arrayImages Images/texts array
     * @param {string} idPlay      play button ID inside HTML
     * @param {string} idLeft      left arrow ID inside HTML
     * @param {string} idRight     right arrow ID inside HTML
     * @param {string} idImages    images ID inside HTML
     * @param {string} txtImages   texts ID inside HTML
     * @param {number} timer       duration between each slide
     * @param {boolean} pause      slider state at init
     */
    constructor(arrayImages, idPlay, idLeft, idRight, idImages, txtImages, timer, pause) {
        this.img = arrayImages;
        this.timer = timer;
        this.pause = pause;
        this.currentSlide = 0;
        // SELECTORS
        this.imgElt = $(`#${idImages}`)[0];
        this.playPause = $(`#${idPlay}`)[0];
        this.arrowLeft = $(`#${idLeft}`)[0];
        this.arrowRight = $(`#${idRight}`)[0];
        this.textElt = $(`#${txtImages}`)[0];
        // EVENTS
        this.playId = setInterval(this.slideRight.bind(this), this.timer);
        $(this.playPause).on("click", this.pausePlay.bind(this)); // 
        $(this.arrowRight).on("click", this.slideRight.bind(this));
        $(this.arrowLeft).on("click", this.slideLeft.bind(this));
        $(document).on("keydown", this.keydown.bind(this));
    }
    /**
     * key arrows <-- -->
     *  @param {object} e event used in the method (keycode)
     */
    keydown(e) {
        if (e.keyCode === 39) {
            this.slideRight();
        } else if (e.keyCode === 37) {
            this.slideLeft();
        }
    }
    /**
     * Slide on next image
     */
    slideRight() {
        this.currentSlide++;
        if (this.currentSlide > this.img.length - 1) {
            this.currentSlide = 0;
        }
        // this.imgElt.src = this.img[this.currentSlide].srcSlide;
        this.imgElt.src = this.img[this.currentSlide].srcSlide;
        this.textElt.textContent = this.img[this.currentSlide].textSlide;
    }
    /**
     * Slide on previous image
     */
    slideLeft() {
        this.currentSlide--;
        if (this.currentSlide < 0) {
            this.currentSlide = this.img.length - 1;
        }
        this.imgElt.src = this.img[this.currentSlide].srcSlide;
        this.textElt.textContent = this.img[this.currentSlide].textSlide;
    }
    /**
     * Switch on pause and play
     */
    pausePlay() {
        // if play --> pause
        if (this.pause === false) {
            this.pause = true;
            $(this.playPause).find("i").attr("class", "fa fa-play");
            clearInterval(this.playId);
        }
        // If pause --> play
        else if (this.pause !== false) {
            this.pause = false;
            $(this.playPause).find("i").attr("class", "fa fa-pause");
            this.playId = setInterval(this.slideRight.bind(this), this.timer);
        }
    }
}
