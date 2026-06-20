/**
 * menu.js
 * Governs the three-dot ellipsis menu dropdown in the modal headers.
 * Applies spring animations and handles dismissals when clicking outside boundaries.
 */

document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.getElementById('three-dots-trigger');
  const dropdown = document.getElementById('modal-dropdown');

  if (!trigger || !dropdown) return;

  // Toggle dropdown on trigger click
  trigger.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = dropdown.classList.contains('open');
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  // Close dropdown on clicking outside
  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target) && event.target !== trigger) {
      closeDropdown();
    }
  });

  // Handle escape key to dismiss dropdown
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && dropdown.classList.contains('open')) {
      closeDropdown();
    }
  });

  function openDropdown() {
    dropdown.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');

    // Stagger transition delay for sub-items
    const items = dropdown.querySelectorAll('.dropdown-item');
    items.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.animation = 'fadeIn 0.2s ease forwards';
      item.style.animationDelay = `${0.05 * (index + 1)}s`;
    });
  }

  function closeDropdown() {
    dropdown.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');

    const items = dropdown.querySelectorAll('.dropdown-item');
    items.forEach(item => {
      item.style.opacity = '';
      item.style.animation = '';
      item.style.animationDelay = '';
    });
  }
});
