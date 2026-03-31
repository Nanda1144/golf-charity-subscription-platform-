/**
 * Mock Email Service (PRD Optimized)
 * Logs notifications to console for MVP proof-of-concept.
 * Architectural anchor for future SendGrid/Postmark integration.
 */

const sendEmail = (to, subject, text, type = 'Alert') => {
  console.log(`\n--- 📧 ENCRYPTED SYSTEM NOTIFICATION [${type.toUpperCase()}] ---`);
  console.log(`TO: ${to}`);
  console.log(`SUBJECT: ${subject}`);
  console.log(`CONTENT: ${text}`);
  console.log(`TIMESTAMP: ${new Date().toISOString()}`);
  console.log(`--- [END NOTIFICATION] ---\n`);
};

const sendWelcomeEmail = (user) => {
  const msg = `Welcome ${user.name} to the Impact Golf Network. Your subscription is active, and your chosen charity is now receiving 10% of your contributions. Good luck in your first draw!`;
  sendEmail(user.email, 'Welcome to The Movement', msg, 'Welcome');
};

const sendWinnerAlert = (user, win) => {
  const msg = `CONGRATULATIONS! You have matched ${win.matchCount} numbers in the monthly draw at GCP. You have won approximately $${win.prizeAmount?.toFixed(2)}. Visit your dashboard to submit proof.`;
  sendEmail(user.email, 'Championship Winner Alert', msg, 'Winner');
};

const sendDrawPublishedAlert = (user) => {
   const msg = `Results for the latest platform draw are now live. Visit the Impact Portal to check your standing.`;
   sendEmail(user.email, 'Platform Draw Results Published', msg, 'Published');
};

module.exports = { sendWelcomeEmail, sendWinnerAlert, sendDrawPublishedAlert };
