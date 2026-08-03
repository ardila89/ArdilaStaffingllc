const form = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');
const typedTextEl = document.getElementById('typed-text');

const sanitizeInput = (value) =>
  value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));

const heroPhrases = [
  'Flexible staff for every event.',
  'Experienced hospitality professionals on demand.',
  'Fast, reliable coverage for busy shifts.',
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

const updateTypedText = () => {
  if (!typedTextEl) return;
  const currentPhrase = heroPhrases[phraseIndex];

  if (isDeleting) {
    charIndex -= 1;
    typedTextEl.textContent = currentPhrase.slice(0, charIndex);
  } else {
    charIndex += 1;
    typedTextEl.textContent = currentPhrase.slice(0, charIndex);
  }

  let delay = isDeleting ? 60 : 120;

  if (!isDeleting && charIndex === currentPhrase.length) {
    delay = 1400;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % heroPhrases.length;
    delay = 400;
  }

  setTimeout(updateTypedText, delay);
};

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();

    if (!name || !email || !message) {
      if (formStatus) {
        formStatus.textContent = 'Please complete all fields before sending.';
        formStatus.style.color = '#b91c1c';
      }
      return;
    }

    if (formStatus) {
      formStatus.textContent = 'Sending your message...';
      formStatus.style.color = '#0f172a';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const safeName = sanitizeInput(name);
      const safeEmail = sanitizeInput(email);
      const safeMessage = sanitizeInput(message);

      if (formStatus) {
        formStatus.textContent = `Thank you, ${safeName}! Your message has been sent and we will contact you soon at ${safeEmail}.`;
        formStatus.style.color = '#166534';
      }
      console.info('Contact form submitted:', safeMessage);
      form.reset();
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = 'Sorry, your message could not be sent right now. Please email us directly at ardilastaffingllc@gmail.com.';
        formStatus.style.color = '#b91c1c';
      }
      console.error('Contact form submission failed:', error);
    }
  });
}

const revealOnScroll = () => {
  sections.forEach((section) => {
    const revealPoint = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (revealPoint < windowHeight - 100) {
      section.classList.add('visible');
    }
  });
};

const updateActiveNav = () => {
  const scrollPosition = window.scrollY + 120;
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const id = section.getAttribute('id');

    if (id && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
};

window.addEventListener('scroll', () => {
  revealOnScroll();
  updateActiveNav();
});

window.addEventListener('load', () => {
  revealOnScroll();
  updateActiveNav();
  updateTypedText();
});
