/**
 * Vercel Project Deletion Helper - Content Script
 * Created by Remco Stoeten
 * GitHub: https://github.com/remcostoeten/easy-delete-vercelprojects-chrome-extension
 */

function extractProjectName() {
  const path = window.location.pathname;
  const match = path.match(/\/([^/]+)-projects\/([^/]+)\/settings/);
  return match ? match[2] : null;
}

function showToast(message, type) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${type === 'success' ? '#18181b' : '#27272a'};
    color: white;
    border: 1px solid ${type === 'success' ? '#3f3f46' : '#52525b'};
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function fillAndSubmit(modal, projectName) {
  const nameInput = modal.querySelector('[data-testid="resource-deletion-modal/name-input"]');
  const verificationInput = modal.querySelector('[data-testid="resource-deletion-modal/verification-input"]');
  const submitButton = modal.querySelector('[data-testid="resource-deletion-modal/confirm-button"]');

  if (nameInput && verificationInput && submitButton) {
    nameInput.value = projectName;
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    nameInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    verificationInput.value = 'delete my project';
    verificationInput.dispatchEvent(new Event('input', { bubbles: true }));
    verificationInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    setTimeout(() => {
      submitButton.click();
      setTimeout(() => {
        showToast('Project deletion submitted', 'success');
      }, 100);
    }, 500);
  }
}

function addPrefillButton() {
  const projectName = extractProjectName();
  if (!projectName) return;

  const observer = new MutationObserver(() => {
    const modal = document.querySelector('[data-testid="resource-deletion-modal/form"]');
    const existingButton = document.querySelector('#vercel-prefill-button');
    
    if (modal && !existingButton) {
      const footer = modal.querySelector('[data-geist-modal-actions]');
      if (footer) {
        const button = document.createElement('button');
        button.id = 'vercel-prefill-button';
        button.type = 'button';
        button.textContent = 'Quick Delete';
        button.className = 'button-module__QyrFCa__base reset-module__ylizOa__reset button-module__QyrFCa__button';
        button.style.cssText = `
          display: flex;
          align-items: center;
          padding: 0 16px;
          height: 40px;
          background: #18181b;
          color: #fafafa;
          border: 1px solid #3f3f46;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          margin-right: auto;
          transition: all 0.15s ease;
        `;
        
        button.addEventListener('mouseenter', () => {
          button.style.background = '#27272a';
          button.style.borderColor = '#52525b';
        });
        
        button.addEventListener('mouseleave', () => {
          button.style.background = '#18181b';
          button.style.borderColor = '#3f3f46';
        });
        
        button.addEventListener('click', () => {
          fillAndSubmit(modal, projectName);
        });
        
        footer.insertBefore(button, footer.firstChild);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

addPrefillButton();
