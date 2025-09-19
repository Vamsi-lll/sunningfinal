

// Render our_values as cards in .ourvalue
window.addEventListener('DOMContentLoaded', function() {
    const valuesContainer = document.querySelector('.ourvalue');
    if (valuesContainer && Array.isArray(our_values)) {
        let html = '<div class="ourvalue-row">';
        our_values.forEach((item, idx) => {
            const bg = idx % 2 === 0 ? 'ourvalue-card-orange' : 'ourvalue-card-black';
            html += `
                <div class="ourvalue-card ${bg}">
                    <div class="ourvalue-content">
                        <h3>${item.head}</h3>
                        <p>${item.p}</p>
                    </div>
                    <div class="ourvalue-img">
                        <img src="${item.img}" alt="${item.head}" />
                    </div>
                </div>
            `;
        });
        html += '</div>';
        valuesContainer.innerHTML = html;
    }
});

// Animated numbers: trigger only when visible
window.addEventListener('DOMContentLoaded', function() {
    function animateNumber({el, from = 0, to, duration = 1500, format, done}) {
        let start = null;
        let rafId;
        function step(ts) {
            if (!start) start = ts;
            let progress = Math.min((ts - start) / duration, 1);
            let value = from + (to - from) * progress;
            el.textContent = format ? format(value, progress) : Math.floor(value);
            if (progress < 1) {
                rafId = requestAnimationFrame(step);
            } else if (done) {
                done();
            }
        }
        rafId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafId);
    }

    function observeAndAnimate(selector, opts) {
        const el = document.querySelector(selector);
        if (!el) return;
        let animated = false;
        const observer = new window.IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animated) {
                animated = true;
                animateNumber({el, ...opts});
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        observer.observe(el);
    }

    // VIEWS: 1 to 150+
    observeAndAnimate('.views-animated-number', {
        from: 1,
        to: 150,
        duration: 1800,
        format: (v, p) => p < 1 ? Math.floor(v) : '150K+',
    });
    // IMPRESSIONS: 1 to 1M+
    observeAndAnimate('.impressions-animated-number', {
        from: 1,
        to: 1000000,
        duration: 1800,
        format: (v, p) => p < 1 ? Math.floor(v).toLocaleString() : '1M+',
    });
    // RATING: 0 to 4.9/5
    observeAndAnimate('.rating-animated-number', {
        from: 0,
        to: 4.9,
        duration: 1200,
        format: (v, p) => p < 1 ? (v).toFixed(1) + '/5' : '4.9/5',
    });
});
// Rating Section Mapping and Navigation
window.addEventListener('DOMContentLoaded', function() {
    const reviews = [
        {
                name: "John Doe",
                text: "Amazing service! My website traffic doubled in a month.",
                rating: 5
        },
        {
                name: "Jane Smith",
                text: "Professional team and great results. Highly recommend.",
                rating: 4
        },
        {
                name: "Alex Lee",
                text: "They helped us grow our brand online. Very satisfied!",
                rating: 5
        }
    ];
    const ratingContent = document.getElementById('rating-content');
    const prevBtn = document.querySelector('.rating-prev');
    const nextBtn = document.querySelector('.rating-next');
    let currentIdx = 0;

        function renderReview(idx, direction = 1) {
            const review = reviews[idx];
            let stars = '';
            for (let i = 0; i < 5; i++) {
                stars += i < review.rating ? '★' : '☆';
            }
            const oldCard = ratingContent.querySelector('.rating-card');
            if (oldCard) {
                oldCard.classList.add('hide');
                setTimeout(() => {
                    ratingContent.innerHTML = `
                        <div class="rating-card" style="animation: slideIn${direction > 0 ? 'Up' : 'Down'} 0.4s;">
                            <div class="rating-name">${review.name}</div>
                            <div class="rating-text">${review.text}</div>
                            <div class="rating-stars">${stars}</div>
                        </div>
                    `;
                }, 350);
            } else {
                ratingContent.innerHTML = `
                    <div class="rating-card">
                        <div class="rating-name">${review.name}</div>
                        <div class="rating-text">${review.text}</div>
                        <div class="rating-stars">${stars}</div>
                    </div>
                `;
            }
        }

    if (ratingContent && prevBtn && nextBtn) {
        renderReview(currentIdx);
            prevBtn.onclick = function() {
                currentIdx = (currentIdx - 1 + reviews.length) % reviews.length;
                renderReview(currentIdx, -1);
            };
            nextBtn.onclick = function() {
                currentIdx = (currentIdx + 1) % reviews.length;
                renderReview(currentIdx, 1);
            };
    }
});
// Interactive Calendar Mapping
window.addEventListener('DOMContentLoaded', function() {
    const calendarContainer = document.querySelector('.calender');
    if (!calendarContainer) return;

    // Get current date
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    // Helper: format date as YYYY-MM-DD
    function formatDate(year, month, day) {
        return year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    }

    // Helper: show error message
    function showCalendarError(msg) {
        let err = calendarContainer.querySelector('.calendar-error');
        if (!err) {
            err = document.createElement('div');
            err.className = 'calendar-error';
            err.style.cssText = 'color: red; margin-top: 8px; font-size: 1em;';
            calendarContainer.appendChild(err);
        }
        err.textContent = msg;
    }
    function clearCalendarError() {
        let err = calendarContainer.querySelector('.calendar-error');
        if (err) err.remove();
    }

    function renderCalendar(month, year) {
        // Get first day of the month
        const firstDay = new Date(year, month, 1).getDay();
        // Get number of days in the month
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        // Month names
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        let html = `<div class="calendar-box">
            <div class="calendar-header">
                <button class="calendar-nav prev">&#60;</button>
                <span class="calendar-month">${monthNames[month]} ${year}</span>
                <button class="calendar-nav next">&#62;</button>
            </div>
            <div class="calendar-days-row">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
            <div class="calendar-grid">`;

        // Fill empty days before first day
        let startDay = firstDay === 0 ? 6 : firstDay - 1;
        for (let i = 0; i < startDay; i++) {
            html += `<span class="calendar-cell empty"></span>`;
        }

        // Fill days
        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            html += `<span class="calendar-cell${isToday ? ' today' : ''}" data-day="${d}">${d}</span>`;
        }
        html += `</div>`;
        // Add action button
        html += `<button class="calendar-mail-btn" style="margin-top:10px;padding:8px 18px;background:var(--orange);color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:600;">Book Consultation</button>`;
        html += `</div>`;
        calendarContainer.innerHTML = html;

        // Add navigation
        calendarContainer.querySelector('.calendar-nav.prev').onclick = function() {
            currentMonth--;
            if (currentMonth < 0) { currentMonth = 11; currentYear--; }
            renderCalendar(currentMonth, currentYear);
        };
        calendarContainer.querySelector('.calendar-nav.next').onclick = function() {
            currentMonth++;
            if (currentMonth > 11) { currentMonth = 0; currentYear++; }
            renderCalendar(currentMonth, currentYear);
        };

        // Add click to select day
        calendarContainer.querySelectorAll('.calendar-cell').forEach(cell => {
            if (!cell.classList.contains('empty')) {
                cell.onclick = function() {
                    calendarContainer.querySelectorAll('.calendar-cell.selected').forEach(c => c.classList.remove('selected'));
                    cell.classList.add('selected');
                    clearCalendarError();
                };
            }
        });

        // Add mail button logic
        const mailBtn = calendarContainer.querySelector('.calendar-mail-btn');
        mailBtn.onclick = function() {
            clearCalendarError();
            const selected = calendarContainer.querySelector('.calendar-cell.selected');
            if (!selected) {
                showCalendarError('Please select a date.');
                return;
            }
            const day = parseInt(selected.getAttribute('data-day'), 10);
            const selectedDate = new Date(currentYear, currentMonth, day);
            // Remove time for comparison
            selectedDate.setHours(0,0,0,0);
            const now = new Date();
            now.setHours(0,0,0,0);
            if (selectedDate < now) {
                showCalendarError('Please select a valid (future) date.');
                return;
            }
            // Open mail client
            const subject = encodeURIComponent('Consultation Booking for ' + formatDate(currentYear, currentMonth, day));
            const mailto = `mailto:sunningyourway@gmail.com?subject=${subject}`;
            window.location.href = mailto;
        };
    }

    renderCalendar(currentMonth, currentYear);
});
// FAQ Section Mapping and Toggle
window.addEventListener('DOMContentLoaded', function() {
    const faqList = document.getElementById('faq-list');
    if (faqList && Array.isArray(faq_data)) {
        let html = '<div class="faq-list">';
        faq_data.forEach((item, idx) => {
            html += `
                <div class="faq-box" data-idx="${idx}">
                    <div class="faq-question-row">
                        <span class="faq-question">${item.question}</span>
                        <button class="faq-toggle-btn" aria-label="Expand/Collapse">+</button>
                    </div>
                    <div class="faq-answer">${item.ans}</div>
                </div>
            `;
        });
        html += '</div>';
        faqList.innerHTML = html;

        // Add toggle logic (Netflix style: only one open at a time)
        const boxes = faqList.querySelectorAll('.faq-box');
        boxes.forEach(box => {
            const btn = box.querySelector('.faq-toggle-btn');
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const isOpen = box.classList.contains('open');
                boxes.forEach(b => b.classList.remove('open'));
                if (!isOpen) box.classList.add('open');
            });
            // Also allow clicking the question row
            box.querySelector('.faq-question-row').addEventListener('click', function(e) {
                if (e.target !== btn) btn.click();
            });
        });
    }
});
// Marquee section mapping for our_portfolio_images (with new CSS)
window.addEventListener('DOMContentLoaded', function() {
    const marque_section = document.querySelector('.marque_section');
    if (marque_section && Array.isArray(our_portfolio_images)) {
        const marqueeWrapper = document.createElement('div');
        marqueeWrapper.className = 'marquee-wrapper';
        // Map images
        our_portfolio_images.forEach(item => {
            if (item && item !== "#") {
                const markq_img = document.createElement('div');
                markq_img.className = 'markq_img';
                const img = document.createElement('img');
                img.src = item;
                img.alt = 'portfolio';
                markq_img.appendChild(img);
                marqueeWrapper.appendChild(markq_img);
            }
        });
        // Duplicate for infinite effect
        our_portfolio_images.forEach(item => {
            if (item && item !== "#") {
                const markq_img = document.createElement('div');
                markq_img.className = 'markq_img';
                const img = document.createElement('img');
                img.src = item;
                img.alt = 'portfolio';
                markq_img.appendChild(img);
                marqueeWrapper.appendChild(markq_img);
            }
        });
        marque_section.innerHTML = '';
        marque_section.appendChild(marqueeWrapper);
    }
});
const our_portfolio_images=[
    "assects/banners/portfolio1.jpg",
    "assects/banners/portfolio2.jpg",
    "assects/banners/portfolio3.jpg",
    "assects/banners/portfolio4.jpg",
    "assects/banners/portfolio5.jpg",
    "assects/banners/portfolio6.jpg",
    "assects/banners/portfolio7.jpg",
    "assects/banners/portfolio8.jpg",
    "assects/banners/portfolio9.jpg",
];




const menuIcon = document.getElementById("menu");
const sider = document.querySelector(".sider");

if (menuIcon && sider) {
  // Open sidebar
  menuIcon.addEventListener("click", () => {
    sider.classList.remove("hidden");
    setTimeout(() => {
      sider.classList.add("slide-in");
    }, 10); // allow reflow for transition
  });

  // Add close button if not present
  let closeBtn = sider.querySelector('.sider-close');
  if (!closeBtn) {
    closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'sider-close';
    closeBtn.style.cssText = 'font-size:2em;position:absolute;top:10px;right:15px;cursor:pointer;z-index:1002;';
    sider.insertBefore(closeBtn, sider.firstChild);
  }
  // Close sidebar
  closeBtn.addEventListener('click', () => {
    sider.classList.remove('slide-in');
    setTimeout(() => {
      sider.classList.add('hidden');
    }, 500); // match CSS transition duration
  });
}

// Render what_we_do_data as a responsive 3-column grid
window.addEventListener('DOMContentLoaded', function() {
    const whatWeDoContainer = document.getElementById('content');
    if (whatWeDoContainer && Array.isArray(what_we_do_data)) {
        let html = '<div class="what-we-do-grid">';
        what_we_do_data.forEach((item, idx) => {
            html += `
                <div class="what-we-do-card">
                    <div class="what-we-do-inner">
                        <div class="what-we-do-img">
                            <img src="${item.icon_img}" alt="${item.hedding}" />
                        </div>
                        <div class="what-we-do-content">
                            <h3>${item.hedding}</h3>
                            <p>${item.passage}</p>
                            <button class="btn btn2"><a href="services.html">Read More</a></button>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        whatWeDoContainer.innerHTML = html;
    }
});


const what_we_do_data = [
    {
        icon_img:'assects/home/seo 1.svg',
        hedding: 'Search Engine Optimization (SEO)',
        passage: 'Increase visibility and rank higher on Google with proven SEO strategies.'
    },
    {
        icon_img: 'assects/home/ppc 1.svg',
        hedding: 'Pay-Per-Click Advertising (PPC)',
        passage: 'Run targeted ad campaigns that deliver instant leads and conversions.'
    },
    {
        icon_img: 'assects/home/social_media_mariketing 1.svg',
        hedding: 'Social Media Marketing',
        passage: 'Engage your audience and grow your brand across major social platforms.'
    },
    {
        icon_img: 'assects/home/content_marketing 1.svg',
        hedding: 'Content Marketing',
        passage: 'Create impactful blogs, videos, and stories that attract and convert'
    },
    {
        icon_img: 'assects/home/email_marketing 1.svg',
        hedding: 'Email Marketing & Automation',
        passage: 'Reach the right people at the right time with personalized campaigns.'
    },
    {
        icon_img: 'assects/home/website_design_development 1.svg',
        hedding: 'Website Design & Development',
        passage: 'Build fast, modern, and user-friendly websites that drive results.'
    }
];



const faq_data=[
    {
        "question":'1. What is digital marketing and why is it important?',
        "ans":'Digital marketing is the promotion of your business through online channels like search engines, social media, email, and websites. It’s important because it helps you reach the right audience, build brand awareness, and generate measurable results faster than traditional marketing.'
    },
    {
        "question":'2. Which services do you offer?',
        "ans":'We provide a complete range of digital marketing services including SEO, social media marketing, PPC advertising, content marketing, email marketing, and graphic design. Our goal is to create strategies that deliver growth and ROI for your business.'
    },
    {
        "question":'3. How long does it take to see results?',
        "ans":'Results vary depending on your industry, competition, and the services used. SEO generally takes a few months to show strong growth, while social media ads and PPC campaigns can generate leads and traffic almost immediately.'
    },
    {
        "question":'4. Do you customize strategies for each client?',
        "ans":'Yes. Every business is unique, so we create personalized digital marketing strategies tailored to your goals, target audience, and budget.'
    },
    {
        "question":'5. What industries do you work with?',
        "ans":'We work with startups, small businesses, and established brands across industries such as retail, e-commerce, healthcare, education, real estate, and more.'
    },
    {
        "question":'6. How do you measure success?',
        "ans":'We track key performance indicators (KPIs) like website traffic, search engine rankings, social media engagement, lead generation, and conversions. You’ll receive detailed reports to see the impact of our work.'
    },
]

reviews = [
    {
        name: "John Doe",
        text: "Amazing service! My website traffic doubled in a month.",
        rating: 5
    },
    {
        name: "Jane Smith",
        text: "Professional team and great results. Highly recommend.",
        rating: 4
    },
    {
        name: "Alex Lee",
        text: "They helped us grow our brand online. Very satisfied!",
        rating: 5
    }
];



const our_values=[
    {
        "head":"Partnerships",
        "p":"Our focus is on creating long-term relationships that grow with your success",
        "img":"assects/about_us/partnership 1.svg"
    },
    {
        "head":"Open Communication",
        "p":"We believe clear communication is the key to effective teamwork and growth",
        "img":"assects/about_us/communication 1.svg"
    },
    {
        "head":"Honesty and Transparency",
        "p":"Every decision we make is guided by what’s best for our client",
        "img":"assects/about_us/transperacy 1.svg"
    },
    {
        "head":"Innovation and Adaptability",
        "p":"Our team thrives on finding solutions and turning challenges into opportunities",
        "img":"assects/about_us/innovation 1.svg"
    },
    {
        "head":"Fidelity",
        "p":"With Sunning Your Way by your side, you can count on steadfast loyalty and support at every step",
        "img":"assects/about_us/fiedelity 1.svg"
    },
    {
        "head":"Growth",
        "p":"We believe growth is a shared journey—strengthening ourselves, our team, and our clients along the way",
        "img":"assects/about_us/growth 1.svg"
    },
    
]
