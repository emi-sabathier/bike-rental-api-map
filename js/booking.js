/**
 * @param {string} idForm       Booking form ID inside HTML
 * @param {object} LeafletObj   Name of the parameter MAP object
 * @param {object} CanvasObj    Name of the parameter CANVAS object
 */
class Booking {
    constructor(idForm, LeafletObj, CanvasObj) {

        this.LeafletObj = LeafletObj;
        this.CanvasObj = CanvasObj;

        $(`#${idForm}`).on("submit", this.booking.bind(this));
        $("#go").on("click", ()=> {
            $('html, body').animate({
                scrollTop: $("#map").offset().top
            }, 1000);
        });
        
        $("#step_timer").hide();
        this.panelBooking();
        this.timer();
        this.fillSession();

    }
    /**
     * Fill name/surname inputs + show timer panel if a local session "count" exists
     */
    fillSession() {
        if ((localStorage.getItem("surname")) && (localStorage.getItem("firstname"))) {
            this.localSurname = localStorage.getItem("surname");
            this.localFirstname = localStorage.getItem("firstname");
            $("#surname").val(this.localSurname);
            $("#firstname").val(this.localFirstname);

        }
        if (sessionStorage.getItem("station") && sessionStorage.getItem("count")) {
            $("#step_timer").show();
            $("#booked_name").text(`${localStorage.getItem("surname")} ${localStorage.getItem("firstname")}`);
            $("#booked_station").text(sessionStorage.getItem("station"));
        }
    }
    /**
     * Return true if ok, else false
     * @param {string} elt    ID of the element to check
     */
    checkInput(elt) { 
        this.regex = /^[a-zA-Z]+$/;
        this.value = $(elt).val();
        if ((this.value.length === 0) || (this.regex.test($(elt).val()) === false)) {
            return false;
        } else {
            return true;
        }
    }
    /**
     * return true or false depending on isEmpty
     */
    checkCanvas() { 
        if (this.CanvasObj.isEmpty === true) {
            return false;
        } else {
            return true;
        }
    }
    /**
     * Send infos in storage
     * panelTimer() => display timer panel
     * timer() => launch the countdown
     * @param {object} e event used in the method, for preventDefault()
     */
    booking(e) {
        e.preventDefault();        
        if ((this.checkCanvas($("#canvas"))) && (this.checkInput($("#firstname"))) && (this.checkInput($("#surname")))) {

            localStorage.setItem("surname", $("#surname").val());
            localStorage.setItem("firstname", $("#firstname").val());
            sessionStorage.setItem("station", this.LeafletObj.selectedStation.name);

            sessionStorage.setItem("bikesLeft", this.LeafletObj.selectedStation.available_bikes - 1); 
            sessionStorage.setItem("count", Date.now()); 

            this.panelTimer();
            this.timer();
        } else {
            $("#inputMsg").text("Veuillez remplir les champs et signer");
        }
    }
    /**
     * minutes set to 20mn. minInMs is the conversion into milliseconds
     * Timer uses the method Date.now(). The time continues to run in background, until session is closed or expired
     */
    timer() {
        const minutes = 20;
        const minInMs = minutes * 60 * 1000;

        let chrono = setInterval(() => {
            let time = Date.now() - Number(sessionStorage.getItem("count"));
            let timeRemain = minInMs - time;

            let minutesRemain = Math.floor(timeRemain / 1000 / 60)
            let secondsRemain = Math.floor(timeRemain / 1000 % 60);

            if (String(secondsRemain).length === 1) {
                secondsRemain = "0" + secondsRemain;
            }
            if (time < minInMs) {
                $("#countdown").text(minutesRemain + "min " + secondsRemain + "s");
            } else {
                clearInterval(chrono);
                sessionStorage.clear();
                $("#step_timer").hide();
            }
        }, 1000);
    }
    /**
     * When click on "Réservation" button, hide infos panel, and show booking panel
     */
    panelBooking() {
        $("#booking_btn").on("click", () => {
            $("#step_booking").show();
            $("#step_infos").hide();
        });
    }
    /**
     * When a booking is submit, show infos on timer panel. Hide booking panel
     */
    panelTimer() {
        $("#step_booking").hide();
        $("#step_timer").show();
        $("#booked_name").text(`${localStorage.getItem("surname")} ${localStorage.getItem("firstname")}`);
        $("#booked_station").text(sessionStorage.getItem("station"));

    }
}
