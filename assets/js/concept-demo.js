// Shared by the concept sites: demo forms never send anything.
const MESSAGE = 'This is a demo — on a real site this would reach the business.';

document.addEventListener('submit', (e) => {
  const form = e.target.closest('form[data-demo]');
  if (!form) return;
  e.preventDefault();
  const note = document.createElement('p');
  note.className = 'demo-note';
  note.setAttribute('role', 'status');
  note.textContent = MESSAGE;
  form.replaceWith(note);
});
