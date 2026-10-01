"use strict";

/* =========================================================
   CANVAS
========================================================= */

const canvas = document.getElementById("posterCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = 1254;
const HEIGHT = 1254;


/* =========================================================
   HTML ELEMENTS
========================================================= */

const photoInput = document.getElementById("photoInput");
const nameInput = document.getElementById("nameInput");
const downloadBtn = document.getElementById("downloadBtn");


/* =========================================================
   REFERENCE IMAGE
========================================================= */

const reference = new Image();

let referenceLoaded = false;

reference.onload = function () {
    referenceLoaded = true;
    drawPoster();
};

reference.onerror = function () {
    alert(
        "reference.png could not be loaded.\n\n" +
        "Make sure reference.png is in the same folder as index.html."
    );
};

reference.src = "reference.png";


/* =========================================================
   USER PHOTO
========================================================= */

const userPhoto = new Image();

let photoLoaded = false;


/* =========================================================
   USER NAME
========================================================= */

let userName = "";


/* =========================================================
   PHOTO UPLOAD
========================================================= */

photoInput.addEventListener("change", function (event) {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    /* Check file type */

    if (!file.type.startsWith("image/")) {

        alert(
            "Please upload a valid JPG, PNG or WEBP image."
        );

        photoInput.value = "";

        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {

        userPhoto.onload = function () {

            photoLoaded = true;

            drawPoster();

        };

        userPhoto.onerror = function () {

            photoLoaded = false;

            alert(
                "Unable to load the selected image."
            );

        };

        userPhoto.src = e.target.result;
    };

    reader.readAsDataURL(file);

});


/* =========================================================
   NAME INPUT
========================================================= */

nameInput.addEventListener("input", function () {

    userName = nameInput.value.trim();

    drawPoster();

});


/* =========================================================
   DRAW COMPLETE POSTER
========================================================= */

function drawPoster() {

    /* Clear canvas */

    ctx.clearRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    /* Wait for reference image */

    if (!referenceLoaded) {
        return;
    }


    /* =====================================================
       DRAW ORIGINAL REFERENCE
    ===================================================== */

    ctx.drawImage(
        reference,
        0,
        0,
        WIDTH,
        HEIGHT
    );


    /* =====================================================
       DRAW USER PHOTO
    ===================================================== */

    if (photoLoaded) {

        drawUserPhoto();

    }


    /* =====================================================
       DRAW USER NAME
    ===================================================== */

    drawUserName();

}


/* =========================================================
   DRAW USER PHOTO
========================================================= */

function drawUserPhoto() {

    /*
        PHOTO POSITION AND SIZE

        These values are based on the
        1254 × 1254 reference poster.
    */

    const photo = {

        /* LEFT / RIGHT POSITION */

        centerX: 472,

        /* UP / DOWN POSITION */

        centerY: 500,

        /* PHOTO AREA WIDTH */

        width: 390,

        /* PHOTO AREA HEIGHT */

        height: 315,

        /* PHOTO TILT */

        angle: -4.2

    };


    /* Convert degrees to radians */

    const angle =
        photo.angle * Math.PI / 180;


    ctx.save();


    /* =====================================================
       MOVE TO PHOTO CENTER
    ===================================================== */

    ctx.translate(
        photo.centerX,
        photo.centerY
    );


    /* =====================================================
       APPLY PHOTO TILT
    ===================================================== */

    ctx.rotate(angle);


    /* =====================================================
       PHOTO CLIPPING AREA
    ===================================================== */

    ctx.beginPath();

    ctx.rect(
        -photo.width / 2,
        -photo.height / 2,
        photo.width,
        photo.height
    );

    ctx.clip();


    /* =====================================================
       WHITE PHOTO BACKGROUND
    ===================================================== */

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        -photo.width / 2,
        -photo.height / 2,
        photo.width,
        photo.height
    );


    /* =====================================================
       GET ORIGINAL IMAGE DIMENSIONS
    ===================================================== */

    const sourceWidth =
        userPhoto.naturalWidth;

    const sourceHeight =
        userPhoto.naturalHeight;


    /* =====================================================
       CONTAIN MODE

       IMPORTANT:

       Math.min() ensures that the COMPLETE
       uploaded image remains visible.

       NOTHING IS CROPPED.

       The original aspect ratio is preserved.
    ===================================================== */

    const scale =
        Math.min(
            photo.width / sourceWidth,
            photo.height / sourceHeight
        );


    /* =====================================================
       CALCULATE FINAL IMAGE SIZE
    ===================================================== */

    const drawWidth =
        sourceWidth * scale;

    const drawHeight =
        sourceHeight * scale;


    /* =====================================================
       CENTER COMPLETE IMAGE
    ===================================================== */

    const drawX =
        -drawWidth / 2;

    const drawY =
        -drawHeight / 2;


    /* =====================================================
       DRAW COMPLETE USER IMAGE
    ===================================================== */

    ctx.drawImage(

        userPhoto,

        /* Source */

        0,
        0,
        sourceWidth,
        sourceHeight,

        /* Destination */

        drawX,
        drawY,
        drawWidth,
        drawHeight

    );


    ctx.restore();

}


/* =========================================================
   DRAW USER NAME
========================================================= */

function drawUserName() {

    /*
        NAME BAR

        Keep these values unchanged because
        this position was already matching
        your reference.
    */

    const box = {

        centerX: 493,

        centerY: 712,

        width: 399,

        height: 67,

        angle: -4.2

    };


    /* Convert angle to radians */

    const angle =
        box.angle * Math.PI / 180;


    ctx.save();


    /* =====================================================
       MOVE TO NAME BAR CENTER
    ===================================================== */

    ctx.translate(
        box.centerX,
        box.centerY
    );


    /* =====================================================
       APPLY NAME BAR TILT
    ===================================================== */

    ctx.rotate(angle);


    /* =====================================================
       COVER ORIGINAL NAME
    ===================================================== */

    /*
        This covers the original name while
        keeping the outer reference design
        visible.
    */

    ctx.fillStyle = "#fff0a8";


    roundedRect(

        ctx,

        -box.width / 2,
        -box.height / 2,

        box.width,
        box.height,

        30

    );


    ctx.fill();


    /* =====================================================
       GET USER NAME
    ===================================================== */

    let name = userName;


    if (!name) {

        name = "Your Name";

    }


    /* =====================================================
       TEXT SETTINGS
    ===================================================== */

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillStyle = "#17205f";


    /* =====================================================
       AUTOMATIC FONT SIZE
    ===================================================== */

    let fontSize = 34;


    while (fontSize > 18) {

        ctx.font =
            `700 ${fontSize}px Arial`;

        if (
            ctx.measureText(name).width
            <=
            box.width * 0.90
        ) {

            break;

        }

        fontSize--;

    }


    /* =====================================================
       HANDLE VERY LONG NAMES
    ===================================================== */

    let displayName = name;


    while (
        ctx.measureText(displayName).width
        >
        box.width * 0.90
        &&
        displayName.length > 3
    ) {

        displayName =
            displayName.substring(
                0,
                displayName.length - 1
            );

    }


    /* Add ellipsis if name was shortened */

    if (displayName !== name) {

        displayName += "...";

    }


    /* =====================================================
       DRAW NAME
    ===================================================== */

    ctx.fillText(
        displayName,
        0,
        1
    );


    ctx.restore();

}


/* =========================================================
   ROUNDED RECTANGLE
========================================================= */

function roundedRect(
    ctx,
    x,
    y,
    width,
    height,
    radius
) {

    const r =
        Math.min(
            radius,
            width / 2,
            height / 2
        );


    ctx.beginPath();


    /* Top-left */

    ctx.moveTo(
        x + r,
        y
    );


    /* Top */

    ctx.lineTo(
        x + width - r,
        y
    );


    /* Top-right */

    ctx.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + r
    );


    /* Right */

    ctx.lineTo(
        x + width,
        y + height - r
    );


    /* Bottom-right */

    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - r,
        y + height
    );


    /* Bottom */

    ctx.lineTo(
        x + r,
        y + height
    );


    /* Bottom-left */

    ctx.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - r
    );


    /* Left */

    ctx.lineTo(
        x,
        y + r
    );


    /* Close */

    ctx.quadraticCurveTo(
        x,
        y,
        x + r,
        y
    );


    ctx.closePath();

}


/* =========================================================
   DOWNLOAD POSTER
========================================================= */

downloadBtn.addEventListener(
    "click",
    function () {

        /* Redraw latest version */

        drawPoster();


        try {

            /* Convert canvas to PNG */

            const dataURL =
                canvas.toDataURL(
                    "image/png"
                );


            /* Create temporary link */

            const link =
                document.createElement("a");


            link.href =
                dataURL;


            link.download =
                "Miro-Qwen-Attending-Poster.png";


            link.style.display =
                "none";


            document.body.appendChild(
                link
            );


            /* Start download */

            link.click();


            /* Remove link */

            document.body.removeChild(
                link
            );

        } catch (error) {

            console.error(
                "Poster download failed:",
                error
            );


            alert(
                "Unable to download the poster. " +
                "Please run the project using Live Server."
            );

        }

    }
);