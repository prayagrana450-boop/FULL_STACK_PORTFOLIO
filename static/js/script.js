/* =========================================================
PRAYAG - FULL STACK DEVELOPER PORTFOLIO
CUSTOM JAVASCRIPT
========================================================= */

"use strict";

/* =========================================================
DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  
initNavbar();

initSmoothScroll();

initActiveNavigation();

initScrollReveal();

initContactForm();

initProjectHover();  

});

/* =========================================================
NAVBAR SCROLL EFFECT
========================================================= */

function initNavbar() {
  
const navbar =
    document.getElementById("navbar");

if (!navbar) return;


function updateNavbar() {

    if (window.scrollY > 50) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

}


updateNavbar();

window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
);  

}

/* =========================================================
SMOOTH SCROLL
========================================================= */

function initSmoothScroll() {
  
const links =
    document.querySelectorAll(
        'a[href^="#"]'
    );


links.forEach(link => {

    link.addEventListener(
        "click",
        function (event) {

            const targetId =
                this.getAttribute("href");


            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }


            const target =
                document.querySelector(
                    targetId
                );


            if (!target) {
                return;
            }


            event.preventDefault();


            const navbar =
                document.getElementById(
                    "navbar"
                );


            const navbarHeight =
                navbar
                    ? navbar.offsetHeight
                    : 0;


            const targetPosition =
                target.getBoundingClientRect().top
                +
                window.scrollY
                -
                navbarHeight
                -
                10;


            window.scrollTo({

                top: targetPosition,

                behavior: "smooth"

            });


            /*
                Close Bootstrap mobile menu
            */

            const navbarMenu =
                document.getElementById(
                    "navbarNav"
                );


            if (
                navbarMenu &&
                navbarMenu.classList.contains(
                    "show"
                )
            ) {

                const toggler =
                    document.querySelector(
                        ".navbar-toggler"
                    );


                if (toggler) {

                    toggler.click();

                }

            }

        }
    );

});  

}

/* =========================================================
ACTIVE NAVIGATION
========================================================= */

function initActiveNavigation() {
  
const sections =
    document.querySelectorAll(
        "section[id]"
    );


const navLinks =
    document.querySelectorAll(
        ".navbar .nav-link"
    );


if (!sections.length) {
    return;
}


function updateActiveLink() {

    let currentSection = "";


    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;


        const sectionHeight =
            section.offsetHeight;


        if (
            window.scrollY >= sectionTop &&
            window.scrollY <
            sectionTop + sectionHeight
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove(
            "active"
        );


        const href =
            link.getAttribute("href");


        if (
            href ===
            `#${currentSection}`
        ) {

            link.classList.add(
                "active"
            );

        }

    });

}


updateActiveLink();


window.addEventListener(
    "scroll",
    updateActiveLink,
    { passive: true }
);  

}

/* =========================================================
SCROLL REVEAL
========================================================= */

function initScrollReveal() {
  
const elements =
    document.querySelectorAll(
        ".skill-card, .project-card, .stat-box, .education-card, .timeline-item, .certificate-card, .contact-form-wrapper, .about-content"
    );


if (!elements.length) {
    return;
}


elements.forEach(element => {

    element.classList.add(
        "reveal"
    );

});


if (
    !("IntersectionObserver" in window)
) {

    elements.forEach(element => {

        element.classList.add(
            "active"
        );

    });

    return;

}


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target.classList.add(
                        "active"
                    );


                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12,
            rootMargin:
                "0px 0px -50px 0px"
        }
    );


elements.forEach(element => {

    observer.observe(element);

});  

}

/* =========================================================
CONTACT FORM
========================================================= */

function initContactForm() {
  
const form =
    document.getElementById(
        "contactForm"
    );


const messageBox =
    document.getElementById(
        "formMessage"
    );


if (!form) {
    return;
}


form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "name"
            );


        const email =
            document.getElementById(
                "email"
            );


        const subject =
            document.getElementById(
                "subject"
            );


        const message =
            document.getElementById(
                "message"
            );


        if (
            !name ||
            !email ||
            !message
        ) {

            return;

        }


        const nameValue =
            name.value.trim();


        const emailValue =
            email.value.trim();


        const subjectValue =
            subject
                ? subject.value.trim()
                : "";


        const messageValue =
            message.value.trim();


        /*
            Basic validation
        */

        if (nameValue.length < 2) {

            showFormMessage(
                "Please enter a valid name.",
                "error"
            );

            name.focus();

            return;

        }


        if (
            !isValidEmail(
                emailValue
            )
        ) {

            showFormMessage(
                "Please enter a valid email address.",
                "error"
            );

            email.focus();

            return;

        }


        if (
            messageValue.length < 10
        ) {

            showFormMessage(
                "Please write a message of at least 10 characters.",
                "error"
            );

            message.focus();

            return;

        }


        /*
            Button loading state
        */

        const button =
            form.querySelector(
                'button[type="submit"]'
            );


        const originalButtonText =
            button
                ? button.innerHTML
                : "";


        if (button) {

            button.disabled = true;

            button.innerHTML = `
                <span
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true">
                </span>
                Sending...
            `;

        }


        /*
            Backend API support
        */

        try {

            const response =
                await fetch(
                    "/api/contact",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name:
                                nameValue,

                            email:
                                emailValue,

                            subject:
                                subjectValue,

                            message:
                                messageValue

                        })

                    }
                );


            /*
                If backend endpoint exists
            */

            if (response.ok) {

                showFormMessage(
                    "Message sent successfully. Thank you for contacting me!",
                    "success"
                );


                form.reset();


            } else {

                /*
                    If endpoint does not exist,
                    show useful fallback.
                */

                showFormMessage(
                    "Your message is ready. Please use the email button below to contact me.",
                    "success"
                );

            }


        } catch (error) {

            console.warn(
                "Contact API unavailable:",
                error
            );


            /*
                Frontend-only portfolio
                fallback
            */

            const mailSubject =
                encodeURIComponent(
                    subjectValue ||
                    "Portfolio Contact"
                );


            const mailBody =
                encodeURIComponent(
                    `Name: ${nameValue}\n\n` +
                    `Email: ${emailValue}\n\n` +
                    `Message:\n${messageValue}`
                );


            showFormMessage(
                "Opening your email client...",
                "success"
            );


            setTimeout(() => {

                window.location.href =
                    `mailto:prayagrana450@gmail.com` +
                    `?subject=${mailSubject}` +
                    `&body=${mailBody}`;

            }, 700);

        } finally {

            setTimeout(() => {

                if (button) {

                    button.disabled = false;

                    button.innerHTML =
                        originalButtonText;

                }

            }, 1000);

        }

    }
);


function showFormMessage(
    text,
    type
) {

    if (!messageBox) {
        return;
    }


    messageBox.textContent =
        text;


    messageBox.style.padding =
        "10px 0";


    if (type === "success") {

        messageBox.style.color =
            "#32d583";

    } else {

        messageBox.style.color =
            "#ff6b6b";

    }


    messageBox.style.opacity =
        "1";

}


}

/* =========================================================
EMAIL VALIDATION
========================================================= */

function isValidEmail(email) {
  
const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


return emailPattern.test(
    email
);  

}

/* =========================================================
PROJECT CARD INTERACTION
========================================================= */

function initProjectHover() {
  
const cards =
    document.querySelectorAll(
        ".project-card"
    );


cards.forEach(card => {

    card.addEventListener(
        "mouseenter",
        () => {

            card.style.setProperty(
                "--mouse-x",
                "50%"
            );

        }
    );


    card.addEventListener(
        "mousemove",
        event => {

            const rect =
                card.getBoundingClientRect();


            const x =
                ((event.clientX -
                    rect.left)
                    /
                    rect.width)
                *
                100;


            const y =
                ((event.clientY -
                    rect.top)
                    /
                    rect.height)
                *
                100;


            card.style.setProperty(
                "--mouse-x",
                `${x}%`
            );


            card.style.setProperty(
                "--mouse-y",
                `${y}%`
            );

        }
    );

});  

}

/* =========================================================
ESC KEY
Close mobile navigation
========================================================= */

document.addEventListener(
"keydown",
event => {
  
    if (event.key !== "Escape") {
        return;
    }


    const navbarMenu =
        document.getElementById(
            "navbarNav"
        );


    if (
        navbarMenu &&
        navbarMenu.classList.contains(
            "show"
        )
    ) {

        const toggler =
            document.querySelector(
                ".navbar-toggler"
            );


        if (toggler) {

            toggler.click();

        }

    }

}  

);

/* =========================================================
EXTERNAL LINKS
========================================================= */

document
.querySelectorAll(
'a[target="_blank"]'
)
.forEach(link => {
  
    link.setAttribute(
        "rel",
        "noopener noreferrer"
    );

});  

/* =========================================================
CONSOLE BRANDING
========================================================= */

console.log(
"%cPrayag | Full Stack Developer",
"font-size: 18px; font-weight: bold; color: #6c63ff;"
);

console.log(
"%cPortfolio loaded successfully.",
"font-size: 12px; color: #00d4ff;"
);
