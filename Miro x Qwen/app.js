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
    console.error(
        "reference.png could not be loaded."
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
   PHOTO FRAME
========================================================= */

const PHOTO = {

    centerX: 472,
    centerY: 500,

    width: 390,
    height: 315,

    angle: -4.2

};


/* =========================================================
   NAME BAR
   KEEPING YOUR EXISTING POSITION
========================================================= */

const NAME_BOX = {

    centerX: 493,
    centerY: 712,

    width: 399,
    height: 67,

    angle: -4.2

};


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


        /* Supported formats */

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];


        if (!allowedTypes.includes(file.type)) {

            alert(
                "Please upload a JPG, JPEG, PNG or WEBP image."
            );

            photoInput.value = "";

            return;
        }


        /* Read image */

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

    ctx.clearRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


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

    const angle =
        PHOTO.angle * Math.PI / 180;


    ctx.save();


    /* =====================================================
       PHOTO CENTER
    ===================================================== */

    ctx.translate(
        PHOTO.centerX,
        PHOTO.centerY
    );


    /* =====================================================
       PHOTO TILT
    ===================================================== */

    ctx.rotate(angle);


    /* =====================================================
       CLIP EXACTLY TO PHOTO FRAME
    ===================================================== */

    ctx.beginPath();

    ctx.rect(
        -PHOTO.width / 2,
        -PHOTO.height / 2,
        PHOTO.width,
        PHOTO.height
    );

    ctx.clip();


    /* =====================================================
       ORIGINAL IMAGE DIMENSIONS
    ===================================================== */

    const imageWidth =
        userPhoto.naturalWidth;

    const imageHeight =
        userPhoto.naturalHeight;


    /* =====================================================
       COVER CALCULATION

       This makes the uploaded photo completely
       occupy the 390 × 315 frame.

       It preserves the original aspect ratio.
    ===================================================== */

    const scale =
        Math.max(
            PHOTO.width / imageWidth,
            PHOTO.height / imageHeight
        );


    /* =====================================================
       SCALED IMAGE SIZE
    ===================================================== */

    const scaledWidth =
        imageWidth * scale;

    const scaledHeight =
        imageHeight * scale;


    /* =====================================================
       CENTER THE IMAGE
    ===================================================== */

    const x =
        (PHOTO.width - scaledWidth) / 2
        - PHOTO.width / 2;


    const y =
        (PHOTO.height - scaledHeight) / 2
        - PHOTO.height / 2;


    /* =====================================================
       DRAW PHOTO
    ===================================================== */

    ctx.drawImage(

        userPhoto,

        0,
        0,
        imageWidth,
        imageHeight,

        x,
        y,
        scaledWidth,
        scaledHeight

    );


    ctx.restore();

}


/* =========================================================
   DRAW USER NAME
========================================================= */

function drawUserName() {

    const angle =
        NAME_BOX.angle * Math.PI / 180;


    ctx.save();


    ctx.translate(
        NAME_BOX.centerX,
        NAME_BOX.centerY
    );


    ctx.rotate(angle);


    /* =====================================================
       NAME BACKGROUND
    ===================================================== */

    ctx.fillStyle =
        "#fff0a8";


    roundedRect(

        ctx,

        -NAME_BOX.width / 2,
        -NAME_BOX.height / 2,

        NAME_BOX.width,
        NAME_BOX.height,

        30

    );


    ctx.fill();


    /* =====================================================
       NAME
    ===================================================== */

    let name =
        userName || "Your Name";


    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.fillStyle =
        "#17205f";


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
            NAME_BOX.width * 0.90
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
        NAME_BOX.width * 0.90
        &&
        displayName.length > 3
    ) {

        displayName =
            displayName.substring(
                0,
                displayName.length - 1
            );

    }


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


    ctx.moveTo(
        x + r,
        y
    );


    ctx.lineTo(
        x + width - r,
        y
    );


    ctx.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + r
    );


    ctx.lineTo(
        x + width,
        y + height - r
    );


    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - r,
        y + height
    );


    ctx.lineTo(
        x + r,
        y + height
    );


    ctx.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - r
    );


    ctx.lineTo(
        x,
        y + r
    );


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

        drawPoster();


        try {

            const dataURL =
                canvas.toDataURL(
                    "image/png"
                );


            const link =
                document.createElement("a");


            link.href =
                dataURL;


            link.download =
                "Miro-Qwen-Attending-Poster.png";


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );


        } catch (error) {

            console.error(
                "Download failed:",
                error
            );


            alert(
                "Unable to download the poster. " +
                "Please run the project using Live Server."
            );

        }

    }
);
