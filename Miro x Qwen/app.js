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
        "Make sure reference.png is in the same folder " +
        "as index.html."
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

photoInput.addEventListener(
    "change",
    function (event) {

        const file =
            event.target.files[0];

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


        /* Read uploaded image */

        const reader =
            new FileReader();


        reader.onload =
            function (e) {

                userPhoto.onload =
                    function () {

                        photoLoaded = true;

                        drawPoster();

                    };


                userPhoto.onerror =
                    function () {

                        photoLoaded = false;

                        alert(
                            "Unable to load the selected image."
                        );

                    };


                userPhoto.src =
                    e.target.result;

            };


        reader.readAsDataURL(file);

    }
);


/* =========================================================
   NAME INPUT
========================================================= */

nameInput.addEventListener(
    "input",
    function () {

        userName =
            nameInput.value.trim();

        drawPoster();

    }
);


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


    /* Wait for reference */

    if (!referenceLoaded) {
        return;
    }


    /* =====================================================
       ORIGINAL POSTER
    ===================================================== */

    ctx.drawImage(
        reference,
        0,
        0,
        WIDTH,
        HEIGHT
    );


    /* =====================================================
       USER PHOTO
    ===================================================== */

    if (photoLoaded) {

        drawUserPhoto();

    }


    /* =====================================================
       USER NAME
    ===================================================== */

    drawUserName();

}


/* =========================================================
   DRAW USER PHOTO
========================================================= */

function drawUserPhoto() {

    /*
        PHOTO SETTINGS

        Change these values only if you want
        to adjust the photo position/size.
    */

    const photo = {

        /* LEFT / RIGHT */

        centerX: 472,

        /* UP / DOWN */

        centerY: 500,

        /* PHOTO WIDTH */

        width: 390,

        /* PHOTO HEIGHT */

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
       PHOTO BOX CLIPPING
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
       WHITE BASE
    ===================================================== */

    ctx.fillStyle =
        "#ffffff";

    ctx.fillRect(
        -photo.width / 2,
        -photo.height / 2,
        photo.width,
        photo.height
    );


    /* =====================================================
       ORIGINAL IMAGE SIZE
    ===================================================== */

    const sourceWidth =
        userPhoto.naturalWidth;

    const sourceHeight =
        userPhoto.naturalHeight;


    /* =====================================================
       DRAW COMPLETE IMAGE

       IMPORTANT:

       We intentionally DO NOT use Math.min()
       or Math.max() here.

       The complete uploaded image is resized
       directly into the photo box.

       Therefore:

       ✔ No cropping
       ✔ No white space
       ✔ Complete photo visible
       ✔ Entire photo box filled

       The image may stretch slightly if its
       original aspect ratio differs from the
       poster photo box.
    ===================================================== */

    ctx.drawImage(

        userPhoto,

        /* Source image */

        0,
        0,
        sourceWidth,
        sourceHeight,

        /* Destination */

        -photo.width / 2,
        -photo.height / 2,

        photo.width,
        photo.height

    );


    ctx.restore();

}


/* =========================================================
   DRAW USER NAME
========================================================= */

function drawUserName() {

    /*
        NAME BAR

        These values are intentionally kept
        the same as your previous version.
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
       MOVE TO NAME BAR
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

    ctx.fillStyle =
        "#fff0a8";


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

    let name =
        userName;


    if (!name) {

        name =
            "Your Name";

    }


    /* =====================================================
       TEXT SETTINGS
    ===================================================== */

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.fillStyle =
        "#17205f";


    /* =====================================================
       AUTOMATIC FONT SIZE
    ===================================================== */

    let fontSize =
        34;


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
       HANDLE LONG NAMES
    ===================================================== */

    let displayName =
        name;


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


    /* Add ... if shortened */

    if (
        displayName !== name
    ) {

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


    /* TOP LEFT */

    ctx.moveTo(
        x + r,
        y
    );


    /* TOP */

    ctx.lineTo(
        x + width - r,
        y
    );


    /* TOP RIGHT */

    ctx.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + r
    );


    /* RIGHT */

    ctx.lineTo(
        x + width,
        y + height - r
    );


    /* BOTTOM RIGHT */

    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - r,
        y + height
    );


    /* BOTTOM */

    ctx.lineTo(
        x + r,
        y + height
    );


    /* BOTTOM LEFT */

    ctx.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - r
    );


    /* LEFT */

    ctx.lineTo(
        x,
        y + r
    );


    /* TOP LEFT */

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

        /* Render latest version */

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


            /* Remove temporary link */

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
