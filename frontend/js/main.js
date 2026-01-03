/**
 * X10Minds Frontend Controller
 * Handles interactions for the demo landing page.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Start Button
    const startBtns = document.querySelectorAll('.btn-primary');
    
    startBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('X10Minds: Please clone the repo and set up Firebase keys to enter the full app.');
        });
    });

    // 2. Glitch Text Effect Initialization
    const glitchTitle = document.querySelector('.glitch-text');
    if(glitchTitle) {
        // Optional: Add more complex JS animation logic here
    }

    // 3. Simple Console Message
    console.log(`
       __  _______  __  ____           __    
      /  |/  / __ \\/  |/  (_)___  ____/ /____
     / /|_/ / / / / /|_/ / / __ \\/ __  / ___/
    / /  / / /_/ / /  / / / / / / /_/ (__  ) 
   /_/  /_/\\____/_/  /_/_/_/ /_/\\__,_/____/  
   
   X10Minds Archery AI Coach - Loaded.
   Ready for target lock.
    `);
});
