/* =========================
   NAMA TAMU DARI URL
   ========================= */

const urlParams = new URLSearchParams(window.location.search);
const guestNameDisplay = document.getElementById("guestNameDisplay");

const guestNameFromURL = urlParams.get("to");

if (guestNameFromURL && guestNameDisplay) {
    // Ubah tanda "-" menjadi spasi
    const guestName = guestNameFromURL.replace(/-/g, " ");

    guestNameDisplay.textContent = guestName;
}

/* =========================
   BUKA UNDANGAN
========================= */

const cover = document.getElementById("cover");
const invitation = document.getElementById("invitation");
const openInvitation = document.getElementById("openInvitation");

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");


openInvitation.addEventListener("click", function () {

    cover.classList.add("cover-opening");
    
    cover.classList.add("hidden");

    invitation.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

    music.play().catch(function () {
        console.log("Browser menunggu interaksi untuk memutar musik.");
    });

});


/* =========================
   MUSIK
========================= */

musicBtn.addEventListener("click", function () {

    if (music.paused) {

        music.play();

        musicBtn.textContent = "♫";

    } else {

        music.pause();

        musicBtn.textContent = "🔇";

    }

});


/* =========================
   COUNTDOWN
========================= */

const eventDate = new Date(
    "2026-08-31T10:00:00+08:00"
).getTime();


function updateCountdown() {

    const now = new Date().getTime();

    let difference = eventDate - now;


    if (difference < 0) {

        difference = 0;

    }


    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );


    const hours = Math.floor(
        (difference %
            (1000 * 60 * 60 * 24))
        /
        (1000 * 60 * 60)
    );


    const minutes = Math.floor(
        (difference %
            (1000 * 60 * 60))
        /
        (1000 * 60)
    );


    const seconds = Math.floor(
        (difference %
            (1000 * 60))
        /
        1000
    );


    document.getElementById("days").textContent =
        String(days).padStart(2, "0");


    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");


    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");


    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");

}


updateCountdown();

setInterval(updateCountdown, 1000);


/* =========================
   COPY REKENING
========================= */

function copyAccount() {

    const account =
        document
        .getElementById("accountNumber")
        .textContent
        .trim();


    navigator.clipboard
        .writeText(account)
        .then(function () {

            const status =
                document.getElementById("copyStatus");

            status.textContent =
                "Nomor rekening berhasil disalin.";

            setTimeout(function () {

                status.textContent = "";

            }, 2500);

        })
        .catch(function () {

            alert(
                "Nomor rekening: " + account
            );

        });

}


/* =========================
   KOMENTAR / UCAPAN
   GOOGLE SHEETS
========================= */

const SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbxmssWvDiuEEW6GHyRGu6FvkSp71iCPQhLiTByqdNpkJNw9H0-4fXOPDb4EkEqIzyfHdw/exec';


document.addEventListener(
    'DOMContentLoaded',
    function () {

        /* =========================
           LOAD KOMENTAR
        ========================= */

        loadComments();


        /* =========================
           FORM SUBMISSION
        ========================= */

        document
            .getElementById('commentForm')
            .addEventListener(
                'submit',
                async function (e) {

                    e.preventDefault();


                    const name =
                        document
                            .getElementById('name')
                            .value
                            .trim();


                    const attendance =
                        document
                            .getElementById('attendance')
                            .value;


                    const commentText =
                        document
                            .getElementById('comment')
                            .value
                            .trim();


                    const submitBtn =
                        this.querySelector(
                            'button[type="submit"]'
                        );


                    const notification =
                        document
                            .getElementById(
                                'notification'
                            );


                    if (
                        name &&
                        attendance &&
                        commentText
                    ) {

                        try {

                            /* Loading */

                            submitBtn.disabled = true;

                            submitBtn.textContent =
                                'Mengirim...';


                            /* =========================
                               DATA YANG DIKIRIM
                            ========================= */

                            const formData =
                                new FormData();


                            formData.append(
                                'name',
                                name
                            );


                            formData.append(
                                'attendance',
                                attendance
                            );


                            formData.append(
                                'comment',
                                commentText
                            );


                            /* =========================
                               KIRIM KE GOOGLE SHEETS
                            ========================= */

                            const response =
                                await fetch(
                                    SCRIPT_URL,
                                    {
                                        method: 'POST',
                                        body: formData
                                    }
                                );


                            const result =
                                await response.json();


                            /* =========================
                               BERHASIL
                            ========================= */

                            if (
                                result.status ===
                                'success'
                            ) {

                                this.reset();


                                notification.textContent =
                                    'Ucapan Anda telah terkirim! Terima kasih.';


                                notification.classList.add(
                                    'show'
                                );


                                setTimeout(
                                    function () {

                                        notification.classList.remove(
                                            'show'
                                        );

                                    },
                                    3000
                                );


                                /* Reload komentar */

                                loadComments();


                            } else {

                                throw new Error(
                                    result.message ||
                                    'Gagal menyimpan data'
                                );

                            }


                        } catch (error) {

                            console.error(
                                'Error:',
                                error
                            );


                            notification.textContent =
                                'Gagal mengirim ucapan: ' +
                                error.message;


                            notification.classList.add(
                                'show'
                            );


                            setTimeout(
                                function () {

                                    notification.classList.remove(
                                        'show'
                                    );

                                },
                                3000
                            );


                        } finally {

                            submitBtn.disabled =
                                false;

                            submitBtn.textContent =
                                'Kirim Ucapan';

                        }

                    }

                }
            );

    }
);


/* =========================
   LOAD KOMENTAR
   DARI GOOGLE SHEETS
========================= */

async function loadComments() {

    try {

        const response =
            await fetch(
                SCRIPT_URL +
                '?t=' +
                Date.now()
            );


        const result =
            await response.json();


        if (
            result.status ===
            'success'
        ) {

            updateCommentList(
                result.comments
            );


            updateStats(
                result.comments
            );

        } else {

            throw new Error(
                result.message ||
                'Gagal memuat komentar'
            );

        }


    } catch (error) {

        console.error(
            'Error loading comments:',
            error
        );


        const commentList =
            document.getElementById(
                'commentList'
            );


        commentList.innerHTML = `
            <p class="wish-error">
                Gagal memuat ucapan.
                Silakan coba beberapa saat lagi.
            </p>
        `;

    }

}


/* =========================
   TAMPILKAN KOMENTAR
========================= */

function updateCommentList(comments) {

    const commentList =
        document.getElementById(
            'commentList'
        );


    if (
        !comments ||
        comments.length === 0
    ) {

        commentList.innerHTML = `
            <p class="wish-empty">
                Belum ada ucapan.
                Jadilah yang pertama memberikan doa!
            </p>
        `;

        return;

    }


    commentList.innerHTML = '';


    comments.forEach(
        function (comment) {

            const commentItem =
                document.createElement(
                    'div'
                );


            commentItem.className =
                'comment-item';


            /* =========================
               DATA
            ========================= */

            const name =
                comment.name ||
                'Tamu';


            const attendance =
                comment.attendance ||
                '';


            const text =
                comment.text ||
                comment.comment ||
                '';


            /* =========================
               STATUS HADIR
            ========================= */

            const attendanceClass =
                attendance === 'hadir'
                    ? 'hadir'
                    : 'tidak';


            const attendanceText =
                attendance === 'hadir'
                    ? 'Hadir'
                    : 'Tidak Hadir';


            /* =========================
               TANGGAL
            ========================= */

            let formattedDate = '';


            if (comment.date) {

                const dateObj =
                    new Date(
                        comment.date
                    );


                if (
                    !isNaN(
                        dateObj.getTime()
                    )
                ) {

                    formattedDate =
                        new Intl.DateTimeFormat(
                            'id-ID',
                            {
                                timeZone:
                                    'Asia/Makassar',

                                year:
                                    'numeric',

                                month:
                                    'long',

                                day:
                                    'numeric',

                                hour:
                                    '2-digit',

                                minute:
                                    '2-digit'
                            }
                        ).format(
                            dateObj
                        );

                }

            }


            /* =========================
               HTML KOMENTAR
            ========================= */

            commentItem.innerHTML = `

                <div class="comment-header">

                    <div class="comment-name">
                        ${escapeHTML(name)}
                    </div>

                    <span
                        class="comment-attendance ${attendanceClass}"
                    >
                        ${attendanceText}
                    </span>

                </div>


                <p class="comment-text">
                    ${escapeHTML(text)}
                </p>


                ${
                    formattedDate
                        ? `
                            <div class="comment-date">
                                ${formattedDate}
                            </div>
                          `
                        : ''
                }

            `;


            commentList.appendChild(
                commentItem
            );

        }
    );

}


/* =========================
   AMANKAN HTML
========================= */

function escapeHTML(text) {

    return String(text).replace(
        /[&<>"']/g,
        function (character) {

            const entities = {

                '&': '&amp;',

                '<': '&lt;',

                '>': '&gt;',

                '"': '&quot;',

                "'": '&#039;'

            };


            return entities[
                character
            ];

        }
    );

}


/* =========================
   STATISTIK
========================= */

function updateStats(comments) {

    if (!comments) {
        return;
    }


    const attendingCount =
        comments.filter(
            function (c) {
                return c.attendance === 'hadir';
            }
        ).length;


    const notAttendingCount =
        comments.filter(
            function (c) {
                return c.attendance === 'tidak';
            }
        ).length;


    const totalComments =
        comments.length;


    /* Statistik utama */

    const attending =
        document.getElementById(
            'attendingCount'
        );

    const notAttending =
        document.getElementById(
            'notAttendingCount'
        );

    const total =
        document.getElementById(
            'totalComments'
        );


    if (attending) {
        attending.textContent =
            attendingCount;
    }


    if (notAttending) {
        notAttending.textContent =
            notAttendingCount;
    }


    if (total) {
        total.textContent =
            totalComments;
    }


    /* Statistik inline */

    const attendingInline =
        document.getElementById(
            'attendingInline'
        );


    const notAttendingInline =
        document.getElementById(
            'notAttendingInline'
        );


    const totalCommentsInline =
        document.getElementById(
            'totalCommentsInline'
        );


    if (attendingInline) {

        const span =
            attendingInline.querySelector(
                'span'
            );

        if (span) {
            span.textContent =
                attendingCount;
        }

    }


    if (notAttendingInline) {

        const span =
            notAttendingInline.querySelector(
                'span'
            );

        if (span) {
            span.textContent =
                notAttendingCount;
        }

    }


    if (totalCommentsInline) {

        const span =
            totalCommentsInline.querySelector(
                'span'
            );

        if (span) {
            span.textContent =
                totalComments;
        }

    }

}

/* =========================================================
   ANIMASI SAAT SCROLL
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const animatedElements =
            document.querySelectorAll(
                `
                section,
                .profile-card,
                .child-card,
                .event-card,
                .gift-card,
                .comment-item,
                .section-title,
                .closing-image,
                .footer
                `
            );


        /*
         * Tandai elemen yang akan
         * dianimasikan
         */

        animatedElements.forEach(
            function (element) {

                /*
                 * Jangan membuat section
                 * menjadi invisible.
                 */

                if (
                    !element.classList.contains(
                        "cover"
                    )
                ) {

                    element.classList.add(
                        "reveal"
                    );

                }

            }
        );


        /*
         * Observer untuk mendeteksi
         * ketika elemen masuk layar
         */

        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "active"
                                );


                                /*
                                 * Setelah muncul,
                                 * tidak perlu diamati
                                 * lagi.
                                 */

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.15
                }
            );


        /*
         * Mulai mengamati semua elemen
         */

        animatedElements.forEach(
            function (element) {

                observer.observe(
                    element
                );

            }
        );

    }
);
