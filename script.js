// script.js - 6 puppies with image gallery + local video file
// All forms submit to Formspree: https://formspree.io/f/xwvzowre

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xwvzowre';
const FALLBACK_EMAIL = 'carolinadelsa542@gmail.com';

const puppies = [
    { 
      id:1, name:"Luna", gender:"Female", age:"8 weeks", personality:"Playful and cuddly, loves children", avail:"Available", 
      img:"images/puppies/luna.jpeg", 
      gallery: [
        "images/puppies/luna-1.jpeg",
        "images/puppies/luna-2.jpeg",
        "images/puppies/luna-3.jpeg"
      ],
      video: "videos/luna.mp4",
      vax:"Up-to-date on vaccines, dewormed", health:"1-year genetic health guarantee", story:"This adorable puppy is a sweetheart with a royal coat." 
    },
    { 
      id:2, name:"Milo", gender:"Male", age:"8 weeks", personality:"Adventurous & loyal", avail:"Available", 
      img:"images/puppies/milo.jpeg", 
      gallery: [
        "images/puppies/milo-1.jpeg",
        "images/puppies/milo-2.jpeg",
        "images/puppies/milo-3.jpeg"
      ],
      video: "videos/milo.mp4",
      vax:"Fully vaccinated, microchipped", health:"Health guarantee + vet records", story:"This playful puppy loves to play fetch and explore." 
    },
    { 
      id:3, name:"Coco", gender:"Female", age:"8 weeks", personality:"Gentle lapdog", avail:"Reserved", 
      img:"images/puppies/coco.jpeg", 
      gallery: [
        "images/puppies/coco-1.jpeg",
        "images/puppies/coco-2.jpeg",
        "images/puppies/coco-3.jpeg"
      ],
      video: "videos/coco.mp4",
      vax:"First shots", health:"Parents OFA tested", story:"This sweet puppy loves snuggling and being held." 
    },
    { 
      id:4, name:"Oliver", gender:"Male", age:"8 weeks", personality:"Energetic and smart", avail:"Available", 
      img:"images/puppies/oliver.jpeg", 
      gallery: [
        "images/puppies/oliver-1.jpeg",
        "images/puppies/oliver-2.jpeg",
        "images/puppies/oliver-3.jpeg"
      ],
      video: "videos/oliver.mp4",
      vax:"Vaccinated & dewormed", health:"Full health guarantee", story:"This energetic puppy is ready to bring joy to your family." 
    },
    { 
      id:5, name:"Daisy", gender:"Female", age:"8 weeks", personality:"Sweet and gentle, loves to cuddle", avail:"Available", 
      img:"images/puppies/daisy.jpeg", 
      gallery: [
        "images/puppies/daisy-1.jpeg",
        "images/puppies/daisy-2.jpeg",
        "images/puppies/daisy-3.jpeg"
      ],
      video: "videos/daisy.mp4",
      vax:"Up-to-date vaccines", health:"Health guarantee included", story:"This gentle little princess enjoys belly rubs and cuddles." 
    },
    { 
      id:6, name:"Teddy", gender:"Male", age:"8 weeks", personality:"Playful and outgoing", avail:"Available", 
      img:"images/puppies/teddy.jpeg", 
      gallery: [
        "images/puppies/teddy-1.jpeg",
        "images/puppies/teddy-2.jpeg",
        "images/puppies/teddy-3.jpeg"
      ],
      video: "videos/teddy.mp4",
      vax:"Vaccinated & microchipped", health:"1-year health guarantee", story:"This outgoing puppy is full of energy and loves kids." 
    }
  ];

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
}

function openModal(modalId) {
  closeAllModals();
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function openPuppyDetail(puppyId) {
  const p = puppies.find(p => p.id === puppyId);
  if (!p) return;
  const detailDiv = document.getElementById('dynamicDetailContent');
  if (detailDiv) {
    const galleryHTML = p.gallery.slice(0,3).map(img => `
      <img src="${img}" style="width:100%; max-width: 150px; height: 120px; object-fit: cover; border-radius: 16px; cursor: pointer;" onclick="window.open(this.src)">
    `).join('');
    
    const firstImage = p.gallery[0] || '';
    const videoHTML = p.video ? `
      <div style="margin: 16px 0;">
        <h4>🐾 Watch this playful puppy</h4>
        <video controls style="width: 100%; border-radius: 24px; box-shadow: var(--shadow-sm);" poster="${firstImage}">
          <source src="${p.video}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <p style="font-size: 0.8rem; margin-top: 8px; color: var(--soft-brown);">👇 Click play to see this adorable puppy in action!</p>
      </div>
    ` : '';
    
    detailDiv.innerHTML = `
      <h2>Adorable Shih Tzu Puppy</h2>
      <div style="display: flex; flex-wrap: wrap; gap: 12px; margin: 16px 0;">
        ${galleryHTML}
      </div>
      ${videoHTML}
      <p><strong>Age:</strong> ${p.age}</p>
      <p><strong>Personality:</strong> ${p.personality}</p>
      <p><strong>Vaccination:</strong> ${p.vax}</p>
      <p><strong>Health Guarantee:</strong> ${p.health}</p>
      <p><strong>Story:</strong> ${p.story}</p>
    `;
  }
  openModal('puppyDetailModal');
  window.currentPuppyId = puppyId;
}

function openReserveModal(puppyName = '') {
  const input = document.getElementById('reservePuppyName');
  if (input) input.value = puppyName;
  openModal('reserveModal');
}

// Helper function to submit form to Formspree with fallback
async function submitToFormspree(formData, successMsgEl, errorMsgEl, resetForm) {
  if (successMsgEl) successMsgEl.style.display = 'none';
  if (errorMsgEl) errorMsgEl.style.display = 'none';
  
  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });
    
    if (response.ok) {
      if (successMsgEl) successMsgEl.style.display = 'block';
      resetForm();
      setTimeout(() => { 
        if (successMsgEl) successMsgEl.style.display = 'none'; 
        closeAllModals(); 
      }, 3000);
    } else {
      // Fallback: send email directly
      const email = formData.get('email');
      const name = formData.get('name');
      const message = formData.get('message');
      const subject = formData.get('_subject') || 'New Form Submission';
      window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage: ${message}`)}`;
      if (successMsgEl) successMsgEl.style.display = 'block';
      resetForm();
      setTimeout(() => { 
        if (successMsgEl) successMsgEl.style.display = 'none'; 
        closeAllModals(); 
      }, 3000);
    }
  } catch (error) {
    // Fallback: send email directly
    const email = formData.get('email');
    const name = formData.get('name');
    const message = formData.get('message');
    const subject = formData.get('_subject') || 'New Form Submission';
    window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage: ${message}`)}`;
    if (successMsgEl) successMsgEl.style.display = 'block';
    resetForm();
    setTimeout(() => { 
      if (successMsgEl) successMsgEl.style.display = 'none'; 
      closeAllModals(); 
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Modal close handlers
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
    const closeBtn = overlay.querySelector('.close-modal');
    if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
  });

  // Reservation Form
  const reserveForm = document.getElementById('reserveForm');
  const reserveSuccessMsg = document.getElementById('reserveSuccessMsg');
  const reserveErrorMsg = document.getElementById('reserveErrorMsg');
  
  if (reserveForm) {
    reserveForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('name', document.getElementById('reserveName')?.value || '');
      formData.append('email', document.getElementById('reserveEmail')?.value || '');
      formData.append('phone', document.getElementById('reservePhone')?.value || '');
      formData.append('puppy', document.getElementById('reservePuppyName')?.value || '');
      formData.append('message', document.getElementById('reserveMsg')?.value || '');
      formData.append('_subject', 'New Puppy Reservation Request - Delasa Forever Shih Tzu');
      formData.append('_replyto', document.getElementById('reserveEmail')?.value || '');
      
      const resetForm = () => reserveForm.reset();
      await submitToFormspree(formData, reserveSuccessMsg, reserveErrorMsg, resetForm);
    });
  }

  // Appointment Form
  const apptForm = document.getElementById('appointmentForm');
  const apptSuccessMsg = document.getElementById('apptSuccessMsg');
  const apptErrorMsg = document.getElementById('apptErrorMsg');
  
  if (apptForm) {
    apptForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('name', document.getElementById('apptName')?.value || '');
      formData.append('email', document.getElementById('apptEmail')?.value || '');
      formData.append('phone', document.getElementById('apptPhone')?.value || '');
      formData.append('preferred_date', document.getElementById('apptDate')?.value || '');
      formData.append('preferred_time', document.getElementById('apptTime')?.value || '');
      formData.append('message', document.getElementById('apptMsg')?.value || '');
      formData.append('_subject', 'New Appointment Request - Delasa Forever Shih Tzu');
      formData.append('_replyto', document.getElementById('apptEmail')?.value || '');
      
      const resetForm = () => apptForm.reset();
      await submitToFormspree(formData, apptSuccessMsg, apptErrorMsg, resetForm);
    });
  }

  // Contact Popup Form
  const contactPopupForm = document.getElementById('contactPopupForm');
  const contactPopupSuccessMsg = document.getElementById('contactPopupSuccessMsg');
  const contactPopupErrorMsg = document.getElementById('contactPopupErrorMsg');
  
  if (contactPopupForm) {
    contactPopupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('name', document.getElementById('contactPopupName')?.value || '');
      formData.append('email', document.getElementById('contactPopupEmail')?.value || '');
      formData.append('message', document.getElementById('contactPopupMsg')?.value || '');
      formData.append('_subject', 'New Contact Message - Delasa Forever Shih Tzu');
      formData.append('_replyto', document.getElementById('contactPopupEmail')?.value || '');
      
      const resetForm = () => contactPopupForm.reset();
      await submitToFormspree(formData, contactPopupSuccessMsg, contactPopupErrorMsg, resetForm);
    });
  }

  // Detail modal buttons - FIXED to open correct forms
  const detailReserveBtn = document.getElementById('detailReserveBtn');
  if (detailReserveBtn) {
    detailReserveBtn.addEventListener('click', () => {
      if (window.currentPuppyId) {
        const puppy = puppies.find(p => p.id === window.currentPuppyId);
        openReserveModal(puppy?.name || '');
      } else {
        openReserveModal();
      }
      // Close the detail modal first
      closeAllModals();
      // Then open the reserve modal
      setTimeout(() => openModal('reserveModal'), 100);
    });
  }
  
  const detailContactBtn = document.getElementById('detailContactBtn');
  if (detailContactBtn) {
    detailContactBtn.addEventListener('click', () => {
      // Close the detail modal first
      closeAllModals();
      // Then open the contact modal
      setTimeout(() => openModal('contactModal'), 100);
    });
  }

  // Mobile menu toggle with close icon
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileClose = document.getElementById('mobileMenuClose');
  const navLinks = document.getElementById('navLinks');
  
  if (mobileBtn && mobileClose && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.add('show');
      mobileBtn.style.display = 'none';
      mobileClose.style.display = 'block';
    });
    
    mobileClose.addEventListener('click', () => {
      navLinks.classList.remove('show');
      mobileBtn.style.display = 'block';
      mobileClose.style.display = 'none';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (!navLinks.contains(event.target) && !mobileBtn.contains(event.target) && !mobileClose.contains(event.target)) {
        navLinks.classList.remove('show');
        mobileBtn.style.display = 'block';
        mobileClose.style.display = 'none';
      }
    });
  }

  // Highlight active nav link
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
    else if (currentPage === '' && href === 'index.html') link.classList.add('active');
  });
});