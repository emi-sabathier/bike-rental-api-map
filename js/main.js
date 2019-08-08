// When page is loaded
$(() => {
    const imgSlider = [
        {
            srcSlide: "img/img_slider_01.jpg",
            textSlide: "Sélectionnez votre station",
        },
        {
            srcSlide: "img/img_slider_02.jpg",
            textSlide: "Cliquez sur réserver",
        },
        {
            srcSlide: "img/img_slider_03.jpg",
            textSlide: "Entrez nom et prénom, signez",
        },
        {
            srcSlide: "img/img_slider_04.jpg",
            textSlide: "C'est réservé !",
        }
    ];
    
    // Instanciations des objets   
    const newSlider = new Slider(imgSlider, "play_pause", "arrow_left", "arrow_right", "images", "texts", 5000, false);
    const newLeaflet = new Leaflet("mapid", 45.75758315373073, 4.832010269165038, 13);       
    const newCanvas = new Canvas("canvas", 150, 150);        
    const newBooking = new Booking("booking_form", newLeaflet, newCanvas);
});